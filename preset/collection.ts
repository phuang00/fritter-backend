import type {HydratedDocument, Types} from 'mongoose';
import type {Preset} from './model';
import PresetModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore presets
 * stored in MongoDB, including adding, finding, updating, and deleting presets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Preset> is the output of the PresetModel() constructor,
 * and contains all the information in Preset. https://mongoosejs.com/docs/typescript.html
 */
class PresetCollection {
  /**
   * Add a preset to the collection
   *
   * @param {string} ownerId - The id of the owner of the preset
   * @param {string} name - The id of the name of the preset
   * @param {Array<string>} members - The ids of the set of members of the list
   * @param {Map<string, boolean>} setting - The settings of the preset
   * @return {Promise<HydratedDocument<Preset>>} - The newly created preset
   */
  static async addOne(ownerId: Types.ObjectId | string, name: string, members: Array<string> | Array<Types.ObjectId>, setting: Map<string, boolean>): Promise<HydratedDocument<Preset>> {
    const preset = new PresetModel({
      ownerId,
      name,
      members,
      setting,
    });
    await preset.save(); // Saves preset to MongoDB
    return (await preset.populate('ownerId')).populate('members');
  }

  /**
   * Find a preset by presetId
   *
   * @param {string} presetId - The id of the preset to find
   * @return {Promise<HydratedDocument<Preset>> | Promise<null> } - The preset with the given presetId, if any
   */
  static async findOne(presetId: Types.ObjectId | string): Promise<HydratedDocument<Preset>> {
    return PresetModel.findOne({_id: presetId}).populate('ownerId').populate('members');
  }

  /**
   * Find a preset by preset name and owner
   *
   * @param {string} ownerId - The id of the owner of the preset
   * @param {string} name - The name of the preset to find
   * @return {Promise<HydratedDocument<Preset>> | Promise<null> } - The preset with the given presetId, if any
   */
   static async findOneByPresetName(ownerId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Preset>> {
    return PresetModel.findOne({ownerId: ownerId, name: name}).populate('ownerId').populate('members');
  }

  /**
   * Get all the presets in the database
   *
   * @return {Promise<HydratedDocument<Preset>[]>} - An array of all of the presets
   */
  static async findAll(): Promise<Array<HydratedDocument<Preset>>> {
    // Retrieves presets and sorts them by alphabetical order
    return PresetModel.find({}).sort({name: 1}).populate('ownerId').populate('members');
  }

  /**
   * Get all the presets in by given owner
   *
   * @param {string} username - The username of owner of the presets
   * @return {Promise<HydratedDocument<Preset>[]>} - An array of all of the presets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Preset>>> {
    const owner = await UserCollection.findOneByUsername(username);
    return PresetModel.find({ownerId: owner._id}).populate('ownerId').populate('members');
  }

  /**
   * Update a preset with the new states
   *
   * @param {string} presetId - The id of the preset to be updated
   * @param {string} name - The new name of the preset
   * @param {Array<string>} members - The new members of the preset
   * @param {Map<string, boolean>} setting - The new settings of the preset
   * @return {Promise<HydratedDocument<Preset>>} - The newly updated preset
   */
  static async updateOne(presetId: Types.ObjectId | string, name: string | undefined, members: Array<string> | Array<Types.ObjectId> | undefined, setting: Map<string, boolean> | undefined): Promise<HydratedDocument<Preset>> {
    const preset = await PresetModel.findOne({_id: presetId});
    if (name) { preset.name = name };
    if (members) { preset.members = members as [Types.ObjectId] };
    if (setting) { preset.setting = setting as Types.Map<boolean>};
    await preset.save();
    return (await preset.populate('ownerId')).populate('members');
  }

  /**
   * Delete a preset with given presetId.
   *
   * @param {string} presetId - The presetId of preset to delete
   * @return {Promise<Boolean>} - true if the preset has been deleted, false otherwise
   */
  static async deleteOne(presetId: Types.ObjectId | string): Promise<boolean> {
    const preset = await PresetModel.deleteOne({_id: presetId});
    return preset !== null;
  }

  /**
   * Delete all the presets by the given owner
   *
   * @param {string} ownerId - The id of owner of presets
   */
  static async deleteMany(ownerId: Types.ObjectId | string): Promise<void> {
    await PresetModel.deleteMany({ownerId});
  }
}

export default PresetCollection;
