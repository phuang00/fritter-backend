import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ListCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as listValidator from '../list/middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get all the lists
 *
 * @name GET /api/lists
 *
 * @return {ListResponse[]} - An array of lists sorted in increasing alphabetical order by list name
 */
/**
 * Get lists by owner.
 *
 * @name GET /api/lists?owner=username
 *
 * @return {ListResponse[]} - An array of lists created by user with username, owner
 * @throws {400} - If owner is not given
 * @throws {404} - if owner is not a recognized username of any user
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if owner query parameter was supplied
    if (req.query.owner !== undefined) {
      next();
      return;
    }

    const allLists = await ListCollection.findAll();
    const response = allLists.map(util.constructListResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isOwnerExists
  ],
  async (req: Request, res: Response) => {
    const ownerLists = await ListCollection.findAllByUsername(req.query.owner as string);
    const response = ownerLists.map(util.constructListResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new list.
 *
 * @name POST /api/lists
 *
 * @param {string} name - The name of the list
 * @param {string} privacy - The privacy settings of the list
 * @param {Array<string>} members - The members in the list
 * @return {ListResponse} - The created list
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the list content is empty or a stream of empty spaces
 * @throws {413} - If the list content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    listValidator.isListNameExists,
    listValidator.isListContentsNonempty,
    listValidator.isValidListContents,
  ],
  async (req: Request, res: Response) => {
    const ownerId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const memberIds = await Promise.all(req.body.members.split('\n').map(async (member: string) => {
      const user = await UserCollection.findOneByUsername(member);
      return user._id.toString();
    }));
    const list = await ListCollection.addOne(ownerId, req.body.name, req.body.privacy, memberIds);

    res.status(201).json({
      message: 'Your list was created successfully.',
      list: util.constructListResponse(list)
    });
  }
);

/**
 * Delete a list
 *
 * @name DELETE /api/lists/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the list
 * @throws {404} - If the listId is not valid
 */
router.delete(
  '/:listId?',
  [
    userValidator.isUserLoggedIn,
    listValidator.isListExists,
    listValidator.isValidListModifier
  ],
  async (req: Request, res: Response) => {
    await ListCollection.deleteOne(req.params.listId);
    res.status(200).json({
      message: 'Your list was deleted successfully.'
    });
  }
);

/**
 * Modify a list
 *
 * @name PUT /api/lists/:id
 *
 * @param {string} content - the new content for the list
 * @return {ListResponse} - the updated list
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the list
 * @throws {404} - If the listId is not valid
 * @throws {400} - If the list content is empty or a stream of empty spaces
 * @throws {413} - If the list content is more than 140 characters long
 */
router.put(
  '/:listId?',
  [
    userValidator.isUserLoggedIn,
    listValidator.isListExists,
    listValidator.isValidListModifier,
    listValidator.isValidListContents
  ],
  async (req: Request, res: Response) => {
    const memberIds = req.body.members ? await Promise.all(req.body.members.split('\n').map(async (member: string) => {
      const user = await UserCollection.findOneByUsername(member);
      return user._id;
    })) : undefined;
    const list = await ListCollection.updateOne(req.params.listId, req.body.name, req.body.privacy, memberIds);
    res.status(200).json({
      message: 'Your list was updated successfully.',
      list: util.constructListResponse(list)
    });
  }
);

export {router as listRouter};
