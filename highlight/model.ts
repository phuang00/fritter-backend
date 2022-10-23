import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Highlight
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Highlight = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  highlighted: boolean;
};

export type PopulatedHighlight = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Freet;
  highlighted: boolean;

};

// Mongoose schema definition for interfacing with a MongoDB table
// Highlights stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const HighlightSchema = new Schema<Highlight>({
  // The freet userId
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // Whether the freet is highlighted
  highlighted: {
    type: Boolean,
    required: true
  }
});

const HighlightModel = model<Highlight>('Highlight', HighlightSchema);
export default HighlightModel;
