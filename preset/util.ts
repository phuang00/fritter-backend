import type {HydratedDocument} from 'mongoose';
import type {Preset, PopulatedPreset} from '../preset/model';

// Update this if you add a property to the Preset type!
type PresetResponse = {
  _id: string;
  owner: string;
  name: string;
  members: Array<string>;
  setting: Array<Array<string | boolean>>;
};

/**
 * Transform a raw Preset object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Preset>} preset - A preset
 * @returns {PresetResponse} - The preset object formatted for the frontend
 */
const constructPresetResponse = (preset: HydratedDocument<Preset>): PresetResponse => {
  const presetCopy: PopulatedPreset = {
    ...preset.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = presetCopy.ownerId;
  const members = presetCopy.members.map(user => user.username);
  const setting = Array.from(presetCopy.setting);
  delete presetCopy.ownerId;
  delete presetCopy.members;
  delete presetCopy.setting
  return {
    ...presetCopy,
    _id: presetCopy._id.toString(),
    owner: username,
    members: members,
    setting: setting,
  };
};

export {
  constructPresetResponse
};
