import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import PresetCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as presetValidator from '../preset/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the presets
 *
 * @name GET /api/presets
 *
 * @return {PresetResponse[]} - An array of presets sorted in increasing alphabetical order by preset name
 */
/**
 * Get presets by owner.
 *
 * @name GET /api/presets?owner=username
 *
 * @return {PresetResponse[]} - An array of presets created by user with username, owner
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

    const allPresets = await PresetCollection.findAll();
    const response = allPresets.map(util.constructPresetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isOwnerExists
  ],
  async (req: Request, res: Response) => {
    const ownerPresets = await PresetCollection.findAllByUsername(req.query.owner as string);
    const response = ownerPresets.map(util.constructPresetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new preset.
 *
 * @name POST /api/presets
 *
 * @param {string} name - The name of the preset
 * @param {Array<string>} members - The members in the preset
 * @param {Map<string, boolean>} setting - The settings of the preset
 * @return {PresetResponse} - The created preset
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the preset content is empty or a stream of empty spaces
 * @throws {413} - If the preset content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    presetValidator.isPresetNameExists,
    presetValidator.isPresetContentsNonempty,
    presetValidator.isValidPresetContents,
  ],
  async (req: Request, res: Response) => {
    const ownerId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const memberIds = await Promise.all(req.body.members.split('\n').map(async (member: string) => {
      const user = await UserCollection.findOneByUsername(member);
      return user._id.toString();
    }));
    const setting = new Map<string, boolean>([["freet", req.body.freetSetting === 'true'], ["highlight", req.body.highlightSetting === 'true']]);
    const preset = await PresetCollection.addOne(ownerId, req.body.name, memberIds, setting);

    res.status(201).json({
      message: 'Your preset was created successfully.',
      preset: util.constructPresetResponse(preset)
    });
  }
);

/**
 * Delete a preset
 *
 * @name DELETE /api/presets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the preset
 * @throws {404} - If the presetId is not valid
 */
router.delete(
  '/:presetId?',
  [
    userValidator.isUserLoggedIn,
    presetValidator.isPresetExists,
    presetValidator.isValidPresetModifier
  ],
  async (req: Request, res: Response) => {
    await PresetCollection.deleteOne(req.params.presetId);
    res.status(200).json({
      message: 'Your preset was deleted successfully.'
    });
  }
);

/**
 * Modify a preset
 *
 * @name PUT /api/presets/:id
 *
 * @param {string} content - the new content for the preset
 * @return {PresetResponse} - the updated preset
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the preset
 * @throws {404} - If the presetId is not valid
 * @throws {400} - If the preset content is empty or a stream of empty spaces
 * @throws {413} - If the preset content is more than 140 characters long
 */
router.put(
  '/:presetId?',
  [
    userValidator.isUserLoggedIn,
    presetValidator.isPresetExists,
    presetValidator.isValidPresetModifier,
    presetValidator.isValidPresetContents
  ],
  async (req: Request, res: Response) => {
    const memberIds = req.body.members ? await Promise.all(req.body.members.split('\n').map(async (member: string) => {
      const user = await UserCollection.findOneByUsername(member);
      return user._id;
    })) : undefined;
    const setting = req.body.freetSetting && req.body.highlightSetting ? new Map<string, boolean>([["freet", req.body.freetSetting === 'true'], ["highlight", req.body.highlightSetting === 'true']]) : undefined;
    const preset = await PresetCollection.updateOne(req.params.presetId, req.body.name, memberIds, setting );
    res.status(200).json({
      message: 'Your preset was updated successfully.',
      preset: util.constructPresetResponse(preset)
    });
  }
);

export {router as presetRouter};
