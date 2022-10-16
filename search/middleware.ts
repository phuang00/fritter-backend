import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import SearchCollection from '../search/collection';

/**
 * Checks if a search with searchId is req.params exists
 */
const isSearchExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.searchId);
  const search = validFormat ? await SearchCollection.findOne(req.params.searchId) : '';
  if (!search) {
    res.status(404).json({
      error: {
        searchNotFound: `Search with search ID ${req.params.searchId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the search input in req.body is valid, i.e not a stream of empty
 * spaces and not more than 25 characters
 */
const isValidSearchContent = (req: Request, res: Response, next: NextFunction) => {
  const {input} = req.body as {input: string};
  if (!input.trim()) {
    res.status(400).json({
      error: 'Search input must be at least one character long.'
    });
    return;
  }

  if (input.length > 25) {
    res.status(413).json({
      error: 'Search input must be no more than 25 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the creator of the search whose searchId is in req.params
 */
const isValidSearchModifier = async (req: Request, res: Response, next: NextFunction) => {
  const search = await SearchCollection.findOne(req.params.searchId);
  const userId = search.userId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' searches.'
    });
    return;
  }

  next();
};

export {
  isValidSearchContent,
  isSearchExists,
  isValidSearchModifier
};
