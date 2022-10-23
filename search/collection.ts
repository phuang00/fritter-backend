import type {HydratedDocument, Types} from 'mongoose';
import type {Search} from './model';
import SearchModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore searches
 * stored in MongoDB, including adding, finding, and deleting searches.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Search> is the output of the SearchModel() constructor,
 * and contains all the information in Search. https://mongoosejs.com/docs/typescript.html
 */
class SearchCollection {
  /**
   * Add a search to the collection
   *
   * @param {string} userId - The id of the user creating the search
   * @param {string} input - The search input
   * @return {Promise<HydratedDocument<Search>>} - The newly created search
   */
  static async addOne(userId: Types.ObjectId | string, input: string): Promise<HydratedDocument<Search>> {
    const date = new Date();
    const search = new SearchModel({
      userId,
      dateCreated: date,
      input,
    });
    await search.save(); // Saves freet to MongoDB
    return search.populate('userId');
  }

  /**
   * Find a search by searchId
   *
   * @param {string} searchId - The id of the search to find
   * @return {Promise<HydratedDocument<Search>> | Promise<null> } - The search with the given searchId, if any
   */
  static async findOne(searchId: Types.ObjectId | string): Promise<HydratedDocument<Search>> {
    return SearchModel.findOne({_id: searchId}).populate('userId');
  }

  /**
   * Get all the searches in the database
   *
   * @return {Promise<HydratedDocument<Search>[]>} - An array of all of the searches
   */
  static async findAll(): Promise<Array<HydratedDocument<Search>>> {
    // Retrieves freets and sorts them from most to least recent
    return SearchModel.find({}).sort({dateCreated: -1}).populate('userId');
  }

  /**
   * Get all the searches by given author
   *
   * @param {string} username - The username of user of the searches
   * @return {Promise<HydratedDocument<Search>[]>} - An array of all of the searches
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Search>>> {
    const user = await UserCollection.findOneByUsername(username);
    return SearchModel.find({userId: user._id}).populate('userId');
  }

  /**
   * Delete a search with given searchId.
   *
   * @param {string} searchId - The searchId of search to delete
   * @return {Promise<Boolean>} - true if the search has been deleted, false otherwise
   */
  static async deleteOne(searchId: Types.ObjectId | string): Promise<boolean> {
    const search = await SearchModel.deleteOne({_id: searchId});
    return search !== null;
  }

  /**
   * Delete all the searches by the given userId
   *
   * @param {string} userId - The id of user whose searches to delete
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await SearchModel.deleteMany({userId});
  }

  /**
   * Delete all the searches by the given username
   *
   * @param {string} username - The username of user whose searches to delete
   */
   static async deleteManyByUsername(username: string): Promise<void> {
    const user = await UserCollection.findOneByUsername(username);
    await SearchModel.deleteMany({userId: user._id});
  }
}

export default SearchCollection;
