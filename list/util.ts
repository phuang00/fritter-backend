import type {HydratedDocument} from 'mongoose';
import type {List, PopulatedList} from '../list/model';

// Update this if you add a property to the List type!
type ListResponse = {
  _id: string;
  owner: string;
  listName: string;
  privacy: string;
  members: Array<string>;
};

/**
 * Transform a raw List object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<List>} list - A list
 * @returns {ListResponse} - The list object formatted for the frontend
 */
const constructListResponse = (list: HydratedDocument<List>): ListResponse => {
  const listCopy: PopulatedList = {
    ...list.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = listCopy.ownerId;
  const members = listCopy.members.map(user => user.username);
  delete listCopy.ownerId;
  delete listCopy.members;
  return {
    ...listCopy,
    _id: listCopy._id.toString(),
    owner: username,
    members: members,
  };
};

export {
  constructListResponse
};
