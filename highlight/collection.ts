import type {HydratedDocument, Types} from 'mongoose';
import type {Highlight} from './model';
import HighlightModel from './model';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore highlights
 * stored in MongoDB, including adding, finding, updating, and deleting highlights.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Highlight> is the output of the HighlightModel() constructor,
 * and contains all the information in Highlight. https://mongoosejs.com/docs/typescript.html
 */
class HighlightCollection {
  /**
   * Add a highlight to the collection
   *
   * @param {string} freetId - The id of the associated freet
   * @param {string} highlighted - Whether the freet is highlighted or not
   * @return {Promise<HydratedDocument<Freet>>} - The newly created highlight
   */
  static async addOne(freetId: Types.ObjectId | string, highlighted: boolean): Promise<HydratedDocument<Highlight>> {
    const highlight = new HighlightModel({
      freetId,
      highlighted
    });
    await highlight.save(); // Saves freet to MongoDB
    return highlight.populate('freetId');
  }

  /**
   * Find a highlight by highlightId
   *
   * @param {string} highlightId - The id of the highlight to find
   * @return {Promise<HydratedDocument<Highlight>> | Promise<null> } - The highlight with the given highlightId, if any
   */
  static async findOne(highlightId: Types.ObjectId | string): Promise<HydratedDocument<Highlight>> {
    return HighlightModel.findOne({_id: highlightId}).populate('freetId');
  }

  /**
   * Find a highlight by freetId
   *
   * @param {string} freetId - The freetId of the highlight to find
   * @return {Promise<HydratedDocument<Highlight>> | Promise<null> } - The highlight with the given freetId, if any
   */
   static async findOneByFreetId(freetId: Types.ObjectId | string): Promise<HydratedDocument<Highlight>> {
    return HighlightModel.findOne({freetId: freetId}).populate('freetId');
  }

  /**
   * Get all the highlights in the database
   *
   * @return {Promise<HydratedDocument<Highlight>[]>} - An array of all of the highlights
   */
  static async findAll(): Promise<Array<HydratedDocument<Highlight>>> {
    return HighlightModel.find({}).populate('freetId');
  }

  /**
   * Get all the highlights in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Highlight>>> {
    const freets = await FreetCollection.findAllByUsername(username);
    return HighlightModel.find({freetId: {$in: freets.map(freet => freet._id)}}).populate('freetId');
  }

  /**
   * Update a highlight with the new highlighted state
   *
   * @param {string} highlightId - The id of the highlight to be updated
   * @param {boolean} highlighted - The new state of the highlight
   * @return {Promise<HydratedDocument<Highlight>>} - The newly updated highlight
   */
  static async updateOne(highlightId: Types.ObjectId | string, highlighted: boolean): Promise<HydratedDocument<Highlight>> {
    const highlight = await HighlightModel.findOne({_id: highlightId});
    highlight.highlighted = highlighted;
    await highlight.save();
    return highlight.populate('freetId');
  }

  /**
   * Update a highlight with the new highlighted state and given freetId
   *
   * @param {string} freetId - The freetId of the highlight to be updated
   * @param {boolean} highlighted - The new state of the highlight
   * @return {Promise<HydratedDocument<Highlight>>} - The newly updated highlight
   */
   static async updateOneByFreetId(freetId: Types.ObjectId | string, highlighted: boolean): Promise<HydratedDocument<Highlight>> {
    const highlight = await HighlightModel.findOne({freetId: freetId});
    highlight.highlighted = highlighted;
    await highlight.save();
    return highlight.populate('freetId');
  }

  /**
   * Delete a highlight with given highlightId.
   *
   * @param {string} highlightId - The highlightId of highlight to delete
   * @return {Promise<Boolean>} - true if the highlight has been deleted, false otherwise
   */
  static async deleteOne(highlightId: Types.ObjectId | string): Promise<boolean> {
    const highlight = await HighlightModel.deleteOne({_id: highlightId});
    return highlight !== null;
  }

  /**
   * Delete a highlight with given freetId.
   *
   * @param {string} freetId - The freetId of highlight to delete
   * @return {Promise<Boolean>} - true if the highlight has been deleted, false otherwise
   */
   static async deleteOneByFreetId(freetId: Types.ObjectId | string): Promise<boolean> {
    const highlight = await HighlightModel.deleteOne({freetId: freetId});
    return highlight !== null;
  }

  /**
   * Delete all the highlights by the given author
   *
   * @param {string} username - The username of author of freets
   */
  static async deleteManyByUsername(username: string): Promise<void> {
    const user = await UserCollection.findOneByUsername(username);
    const freets = await FreetCollection.findAllByUsername(user.username);
    await HighlightModel.deleteMany({freetId: {$in: freets.map(freet => freet._id)}});
  }
}

export default HighlightCollection;
