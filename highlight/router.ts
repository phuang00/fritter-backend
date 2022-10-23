import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import HighlightCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as highlightValidator from "../highlight/middleware";
import * as util from './util';

const router = express.Router();

/**
 * Get all the highlights
 *
 * @name GET /api/highlights
 *
 * @return {HighlightResponse[]} - An array of all the highlights.

 */
/**
 * Get highlights by user.
 *
 * @name GET /api/highlights?author=username
 *
 * @return {HighlightResponse[]} - An array of freets created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allHighlights = await HighlightCollection.findAll();
    const response = allHighlights.map(util.constructHighlightResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreets = await HighlightCollection.findAllByUsername(req.query.author as string);
    const response = authorFreets.map(util.constructHighlightResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new highlight.
 *
 * @name POST /api/highlights
 *
 * @param {string} freetId - The freetId of the associated freet
 * @param {boolean} highlighted - Whether the freet is highlighted or not
 * @return {HighlightResponse} - The created highlight
 * @throws {403} - If the user is not logged in or is not allowed to create the highlight for the associated freet
 * @throws {404} - if the freetId is invalid
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    highlightValidator.isValidFreetId,
    highlightValidator.isValidHighlightFreetIdModifier
  ],
  async (req: Request, res: Response) => {
    const highlight = await HighlightCollection.addOne(req.body.freetId, req.body.highlighted);

    res.status(201).json({
      message: 'Your highlight was created successfully.',
      highlight: util.constructHighlightResponse(highlight)
    });
  }
);

/**
 * Delete a highlight by freetId
 *
 * @name DELETE /api/highlights/freet/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
 router.delete(
  '/freet/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    highlightValidator.isHighlightFreetIdExists,
    highlightValidator.isValidHighlightModifier
  ],
  async (req: Request, res: Response) => {
    await HighlightCollection.deleteOneByFreetId(req.params.freetId);
    res.status(200).json({
      message: 'Your highlight was deleted successfully.'
    });
  }
);

/**
 * Delete a highlight
 *
 * @name DELETE /api/highlights/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the highlightId is not valid
 */
router.delete(
  '/:highlightId?',
  [
    userValidator.isUserLoggedIn,
    highlightValidator.isHighlightExists,
    highlightValidator.isValidHighlightModifier
  ],
  async (req: Request, res: Response) => {
    await HighlightCollection.deleteOne(req.params.highlightId);
    res.status(200).json({
      message: 'Your highlight was deleted successfully.'
    });
  }
);

/**
 * Delete all highlights by author
 *
 * @name DELETE /api/highlights/user/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the highlight
 */
 router.delete(
  '/user/:author?',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists,
    highlightValidator.isValidHighlightDeleter
  ],
  async (req: Request, res: Response) => {
    await HighlightCollection.deleteManyByUsername(req.params.author);
    res.status(200).json({
      message: 'Your highlights were deleted successfully.'
    });
  }
);

/**
 * Update a highlight given highlightId
 *
 * @name PUT /api/highlights/:id
 *
 * @param {boolean} highlighted - the new state of the highlight
 * @return {HighlightResponse} - the updated highlight
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the highlight
 * @throws {404} - If the highlightId is not valid
 */
router.put(
  '/:highlightId?',
  [
    userValidator.isUserLoggedIn,
    highlightValidator.isHighlightExists,
    highlightValidator.isValidHighlightModifier
  ],
  async (req: Request, res: Response) => {
    const highlight = await HighlightCollection.updateOne(req.params.highlightId, req.body.highlighted);
    res.status(200).json({
      message: 'Your highlight was updated successfully.',
      highlight: util.constructHighlightResponse(highlight)
    });
  }
);

/**
 * Update a highlight given associated freetId
 *
 * @name PUT /api/highlights/freet/:freetId
 *
 * @param {boolean} highlighted - the new state of the highlight
 * @return {HighlightResponse} - the updated highlight
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the highlight
 * @throws {404} - If the freetId is not valid
 */
 router.put(
  '/freet/:freetId?',
  [
    userValidator.isUserLoggedIn,
    highlightValidator.isHighlightFreetIdExists,
    highlightValidator.isValidHighlightFreetIdModifier
  ],
  async (req: Request, res: Response) => {
    const highlight = await HighlightCollection.updateOneByFreetId(req.params.freetId, req.body.highlighted);
    res.status(200).json({
      message: 'Your highlight was updated successfully.',
      highlight: util.constructHighlightResponse(highlight)
    });
  }
);

export {router as highlightRouter};
