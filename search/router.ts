import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import SearchCollection from './collection';
import * as userValidator from '../user/middleware';
import * as searchValidator from '../search/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the searches
 *
 * @name GET /api/searches
 *
 * @return {SearchResponse[]} - A list of all the searches sorted in descending
 *                      order by date created
 */
/**
 * Get searches by author.
 *
 * @name GET /api/searches?userId=id
 *
 * @return {SearchResponse[]} - An array of searches created by user with id, userId
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allSearches = await SearchCollection.findAll();
    const response = allSearches.map(util.constructSearchResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const userSearches = await SearchCollection.findAllByUsername(req.query.author as string);
    const response = userSearches.map(util.constructSearchResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new search.
 *
 * @name POST /api/searches
 *
 * @param {string} input - The search input
 * @return {SearchResponse} - The created search
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the search input is empty or a stream of empty spaces
 * @throws {413} - If the search input is more than 25 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    searchValidator.isValidSearchContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const search = await SearchCollection.addOne(userId, req.body.input);

    res.status(201).json({
      message: 'Your search was created successfully.',
      search: util.constructSearchResponse(search)
    });
  }
);

/**
 * Delete a search
 *
 * @name DELETE /api/searches/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the creator of
 *                 the search
 * @throws {404} - If the searchId is not valid
 */
router.delete(
  '/:searchId?',
  [
    userValidator.isUserLoggedIn,
    searchValidator.isSearchExists,
    searchValidator.isValidSearchModifier
  ],
  async (req: Request, res: Response) => {
    await SearchCollection.deleteOne(req.params.searchId);
    res.status(200).json({
      message: 'Your search was deleted successfully.'
    });
  }
);

/**
 * Delete all searches for user
 *
 * @name DELETE /api/searches/user/:userId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the creator of 
 *                 the search
*/
router.delete(
  '/user/:user?',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists,
    searchValidator.isValidSearchDeleter
  ],
  async (req: Request, res: Response) => {
    const username = (req.params.user as string) ?? ''; // Will not be an empty string since its validated in isUserExists
    await SearchCollection.deleteManyByUsername(username);
    res.status(200).json({
      message: 'Your searches were deleted successfully.'
    });
  }
);

export {router as searchRouter};
