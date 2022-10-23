import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import {Types} from 'mongoose';
import HighlightCollection from '../highlight/collection';
import UserCollection from '../user/collection';

/**
* Checks if the current user is the author of the highlight whose freetId is in req.body
*/
const isValidHighlightFreetIdModifier = async (req: Request, res: Response, next: NextFunction) => {
 const freet = await FreetCollection.findOne(req.body.freetId ? req.body.freetId : req.params.freetId);
 const userId = freet.authorId._id;
 if (req.session.userId !== userId.toString()) {
   res.status(403).json({
     error: 'Cannot modify other users\' highlights.'
   });
   return;
 }

 next();
};

/**
* Checks if the current user is the author of the highlight whose highlightId is in req.params
*/
const isValidHighlightModifier = async (req: Request, res: Response, next: NextFunction) => {
  const highlight = await HighlightCollection.findOne(req.params.highlightId);
  const freet = await FreetCollection.findOne(highlight.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' highlights.'
    });
    return;
  }
 
  next();
 };

/**
 * Checks if a highlight with highlightId in req.params exists
 */
 const isHighlightExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.highlightId);
  const highlight = validFormat ? await HighlightCollection.findOne(req.params.highlightId) : '';
  if (!highlight) {
    res.status(404).json({
      error: {
        highlightNotFound: `Highlight with highlight ID ${req.params.highlightId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a highlight with freetId in req.params exists
 */
 const isHighlightFreetIdExists = async (req: Request, res: Response, next: NextFunction) => {
  const highlight = await HighlightCollection.findOneByFreetId(req.params.freetId);
  if (!highlight) {
    res.status(404).json({
      error: {
        highlightNotFound: `Highlight with highlight ID ${req.params.highlightId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
* Checks if the freetId in req.body is valid
*/
const isValidFreetId = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the user whose searches we are trying to delete
 */
 const isValidHighlightDeleter = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.params.author)
  const userId = user._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot delete other users\' searches.'
    });
    return;
  }

  next();
};

export {
  isValidHighlightFreetIdModifier,
  isValidHighlightModifier,
  isHighlightExists,
  isHighlightFreetIdExists,
  isValidFreetId,
  isValidHighlightDeleter,
};
