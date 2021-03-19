import { model, Schema, Model } from 'mongoose';
import { RecipeDocument } from '../types';

const { ObjectId } = Schema.Types;

const RecipeSchema = new Schema(
  {
    name: String,
    images: [String],
    createdBy: { type: ObjectId, ref: 'User' },
    private: Boolean,
    ingredients: [{ type: ObjectId, ref: 'Ingredient' }],
    description: [String],
    prepTime: Number,
    cookbooked: [{ type: ObjectId, ref: 'User' }],
    cookbookedNumber: Number,
    likes: [{ type: ObjectId, ref: 'User' }],
    likesNumber: Number,
    kcal: Number,
  },
  { timestamps: true }
);

export const Recipe = model<RecipeDocument, Model<RecipeDocument>>(
  'Recipe',
  RecipeSchema
);
