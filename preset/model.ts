import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Notification Preset
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Preset on the backend
export type Preset = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  ownerId: Types.ObjectId;
  name: string;
  members: [Types.ObjectId];
  setting: Types.Map<boolean>;
};

export type PopulatedPreset = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  ownerId: User;
  name: string;
  members: [User];
  setting: Types.Map<boolean>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Presets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PresetSchema = new Schema<Preset>({
  // The owner userId
  ownerId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The name of the preset
  name: {
    type: String,
    required: true
  },
  // The members of the preset
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    required: true
  },
  // The settings of the preset
  setting: {
    type: Map,
    of: Boolean,
    required: true
  }
});

const PresetModel = model<Preset>('Preset', PresetSchema);
export default PresetModel;
