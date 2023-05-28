import { Schema, SchemaTypes, model } from 'mongoose';
import { TagType } from '../../types';

export const tagSchema = new Schema<TagType>({
  name: { type: SchemaTypes.String, required: true, unique: true },
  type: String,
  content: { type: SchemaTypes.String, required: true, unique: true },
  ownerId: { type: SchemaTypes.String, required: true },
  createdAt: { type: SchemaTypes.Date, required: true, immutable: true },
  updatedAt: { type: SchemaTypes.Date, required: true },
});

export const Tag = model('Tag', tagSchema);
