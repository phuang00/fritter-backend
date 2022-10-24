import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import ListCollection from '../list/collection';
import { Privacy } from './model';

/**
 * Checks if a list with listId is req.params exists
 */
const isListExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.listId);
  const list = validFormat ? await ListCollection.findOne(req.params.listId) : '';
  if (!list) {
    res.status(404).json({
      error: {
        listNotFound: `List with list ID ${req.params.listId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if all the contents of the list in req.body is given
 */
 const isListContentsNonempty = (req: Request, res: Response, next: NextFunction) => {
  const {name, privacy, members} = req.body as {name: string, privacy: string, members: string};
  if (!(name.trim() && privacy && members)) {
    res.status(404).json({
      error: 'List content (name/privacy/members) is missing.'
    });
    return;
  }

  next();
};

/**
 * Checks if the contents of the list in req.body is valid
 */
const isValidListContents = async (req: Request, res: Response, next: NextFunction) => {
  const {name, privacy, members} = req.body as {name: string, privacy: string, members: string};
  if (name) {
    if (!name.trim()) {
      res.status(400).json({
        error: 'List name must be at least one character long.'
      });
      return;
    }

    if (name.trim().length > 25) {
      res.status(413).json({
        error: 'List name must be no more than 25 characters.'
      });
      return;
    }
  }
  
  if (privacy) {
    if (!Object.values<string>(Privacy).includes(privacy)) {
      res.status(400).json({
        error: 'List privacy settings must be either public or private.'
      });
      return;
    }
  }

  if (members) {
    for (const member of members.split('\n')) {
      const user = await UserCollection.findOneByUsername(member);
      if (!user) {
        res.status(404).json({
          error: {
            userNotFound: `Member with username ${member} does not exist.`
          }
        });
        return;
      }
      if (user._id.toString() === req.session.userId) {
        res.status(403).json({
          error: 'Cannot add yourself to your own list.'
        });
        return;
      }
    }
  }

  next();
};

/**
 * Checks if the current user is the owner of the list whose listId is in req.params
 */
const isValidListModifier = async (req: Request, res: Response, next: NextFunction) => {
  const list = await ListCollection.findOne(req.params.listId);
  const ownerId = list.ownerId._id;
  if (req.session.userId !== ownerId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' lists.'
    });
    return;
  }

  next();
};

/**
 * Checks if a list with listName as name in req.body exists
 */
 const isListNameExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name) {
    res.status(400).json({
      error: 'Provided list name must be nonempty.'
    });
    return;
  }

  const list = await ListCollection.findOneByListName(req.session.userId, req.body.name as string);
  if (list) {
    res.status(404).json({
      error: `A list with list name ${req.body.name as string} already exists.`
    });
    return;
  }

  next();
};

export {
  isListContentsNonempty,
  isValidListContents,
  isListExists,
  isListNameExists,
  isValidListModifier,
};
