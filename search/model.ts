import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Search
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Search on the backend
export type Search = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  dateCreated: Date;
  input: string;
};

export type PopulatedSearch = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  dateCreated: Date;
  input: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Searches stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const SearchSchema = new Schema<Search>({
  // The author userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the search was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The search input
  input: {
    type: String,
    required: true
  },
});

const SearchModel = model<Search>('Search', SearchSchema);
export default SearchModel;
