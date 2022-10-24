import {HydratedDocument, Types} from 'mongoose';
import type {List, Privacy} from './model';
import ListModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore lists
 * stored in MongoDB, including adding, finding, updating, and deleting lists.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<List> is the output of the ListModel() constructor,
 * and contains all the information in List. https://mongoosejs.com/docs/typescript.html
 */
class ListCollection {
  /**
   * Add a list to the collection
   *
   * @param {string} ownerId - The id of the owner of the list
   * @param {string} listName - The name of the list
   * @param {Privacy} privacy - The privacy setting of the list
   * @param {Array<string>} members - The ids of the set of members of the list
   * @return {Promise<HydratedDocument<List>>} - The newly created list
   */
  static async addOne(ownerId: Types.ObjectId | string, listName: string, privacy: Privacy, members: Array<string> | Array<Types.ObjectId>): Promise<HydratedDocument<List>> {
    const list = new ListModel({
      ownerId,
      listName,
      privacy,
      members,
    });
    await list.save(); // Saves freet to MongoDB
    return (await list.populate('ownerId')).populate('members');
  }

  /**
   * Find a list by listId
   *
   * @param {string} listId - The id of the list to find
   * @return {Promise<HydratedDocument<List>> | Promise<null> } - The list with the given listId, if any
   */
  static async findOne(listId: Types.ObjectId | string): Promise<HydratedDocument<List>> {
    return ListModel.findOne({_id: listId}).populate('ownerId').populate('members');
  }

  /**
   * Find a list by listId
   *
   * @param {string} listName - The name of the list to find
   * @return {Promise<HydratedDocument<List>> | Promise<null> } - The list with the given listId, if any
   */
   static async findOneByListName(listName: string): Promise<HydratedDocument<List>> {
    return ListModel.findOne({listName: listName}).populate('ownerId').populate('members');
  }

  /**
   * Get all the lists in the database
   *
   * @return {Promise<HydratedDocument<List>[]>} - An array of all of the lists
   */
  static async findAll(): Promise<Array<HydratedDocument<List>>> {
    return ListModel.find({}).populate('ownerId').populate('members');
  }

  /**
   * Get all the lists in by given owner
   *
   * @param {string} username - The username of owner of the lists
   * @return {Promise<HydratedDocument<List>[]>} - An array of all of the lists
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<List>>> {
    const owner = await UserCollection.findOneByUsername(username);
    return ListModel.find({ownerId: owner._id}).populate('ownerId').populate('members');
  }

  /**
   * Update a list with the new states
   *
   * @param {string} listId - The id of the list to be updated
   * @param {string} name - The new name of the list
   * @param {string} privacy - The new privacy setting of the list
   * @param {Array<string>} members - The new members of the list
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(listId: Types.ObjectId | string, name: string | undefined, privacy: Privacy | undefined, members: Array<string> | Array<Types.ObjectId> | undefined): Promise<HydratedDocument<List>> {
    const list = await ListModel.findOne({_id: listId});
    if (name) { list.listName = name };
    if (privacy) { list.privacy = privacy };
    if (members) { list.members as [Types.ObjectId] };
    await list.save();
    return (await list.populate('ownerId')).populate('members');
  }

  /**
   * Delete a list with given listId.
   *
   * @param {string} listId - The listId of list to delete
   * @return {Promise<Boolean>} - true if the list has been deleted, false otherwise
   */
  static async deleteOne(listId: Types.ObjectId | string): Promise<boolean> {
    const list = await ListModel.deleteOne({_id: listId});
    return list !== null;
  }

  /**
   * Delete all the lists by the given owner
   *
   * @param {string} ownerId - The id of owner of lists
   */
  static async deleteMany(ownerId: Types.ObjectId | string): Promise<void> {
    await ListModel.deleteMany({ownerId});
  }
}

export default ListCollection;
