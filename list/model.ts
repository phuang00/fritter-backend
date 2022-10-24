import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
export enum Privacy {
  Public = 'public',
  Private = 'private'
}

/**
 * This file defines the properties stored in a List
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for List on the backend
export type List = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  ownerId: Types.ObjectId;
  listName: string;
  privacy: string;
  members: [Types.ObjectId];
};

export type PopulatedList = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  ownerId: User;
  listName: string;
  privacy: string;
  members: [User];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Lists stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ListSchema = new Schema<List>({
  // The owner userId
  ownerId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The name of the list
  listName: {
    type: String,
    required: true
  },
  // The privacy setting of the list
  privacy: {
    type: String,
    enum: Object.values(Privacy),
    required: true
  },
  // The set of users in the list
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    required: true
  }
});

const ListModel = model<List>('List', ListSchema);
export default ListModel;
