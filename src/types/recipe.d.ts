import { Document } from 'mongoose';
import { IngredientDocument } from '.';
import { UserDocument } from '.';

export interface RecipeDocument extends Document {
  id: string;
  name: string;
  images: [string];
  createdBy: UserDocument['id'];
  public: boolean;
  ingredients: [IngredientDocument['id']];
  description: [RecipeDocument['id']];
  prepTime: number;
  cookbooked: [UserDocument['id']];
  likes: [UserDocument['id']];
  likesNumber: number;
  kcal: number;
}
