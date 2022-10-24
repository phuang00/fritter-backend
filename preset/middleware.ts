import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import PresetCollection from '../preset/collection';

/**
 * Checks if a preset with presetId is req.params exists
 */
const isPresetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.presetId);
  const preset = validFormat ? await PresetCollection.findOne(req.params.presetId) : '';
  if (!preset) {
    res.status(404).json({
      error: {
        presetNotFound: `Preset with preset ID ${req.params.presetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if all the contents of the preset in req.body is given
 */
 const isPresetContentsNonempty = (req: Request, res: Response, next: NextFunction) => {
  const {name, members, freetSetting, highlightSetting} = req.body as {name: string, members: Array<string>, freetSetting: string, highlightSetting: string};
  if (!(name.trim() && members && freetSetting && highlightSetting)) {
    res.status(404).json({
      error: 'Preset content (name/members/setting) is missing.'
    });
    return;
  }

  next();
};

/**
 * Checks if the contents of the preset in req.body is valid
 */
const isValidPresetContents = async (req: Request, res: Response, next: NextFunction) => {
  const {name, members, freetSetting, highlightSetting} = req.body as {name: string, members: string, freetSetting: string, highlightSetting: string};
  if (name) {
    if (!name.trim()) {
      res.status(400).json({
        error: 'Preset name must be at least one character long.'
      });
      return;
    }

    if (name.trim().length > 25) {
      res.status(413).json({
        error: 'Preset name must be no more than 25 characters.'
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
          error: 'Cannot add yourself to your own preset.'
        });
        return;
      }
    }
  }

  if ((freetSetting && !highlightSetting) || (!freetSetting && highlightSetting)) {
    res.status(404).json({
      error: 'Preset settings cannot be partially filled.'
    });
    return;
  }

  if (freetSetting) {
    if (freetSetting !== 'true' && freetSetting !== 'false') {
      res.status(400).json({
        error: 'Preset settings must be either true or false.'
      });
      return;
    }
  }

  if (highlightSetting) {
    if (freetSetting !== 'true' && freetSetting !== 'false') {
      res.status(400).json({
        error: 'Preset settings must be either true or false.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the current user is the owner of the preset whose presetId is in req.params
 */
const isValidPresetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const preset = await PresetCollection.findOne(req.params.presetId);
  const ownerId = preset.ownerId._id;
  if (req.session.userId !== ownerId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' presets.'
    });
    return;
  }

  next();
};

/**
 * Checks if a preset with presetName as name in req.body exists
 */
 const isPresetNameExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name) {
    res.status(400).json({
      error: 'Provided preset name must be nonempty.'
    });
    return;
  }

  const preset = await PresetCollection.findOneByPresetName(req.session.userId, req.body.name as string);
  if (preset) {
    res.status(404).json({
      error: `A preset with preset name ${req.body.name as string} already exists.`
    });
    return;
  }

  next();
};

export {
  isPresetNameExists,
  isPresetExists,
  isPresetContentsNonempty,
  isValidPresetContents,
  isValidPresetModifier,
};
