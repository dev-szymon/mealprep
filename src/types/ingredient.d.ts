import { Document } from 'mongoose';
import { UserDocument } from './';

export interface IngredientDocument extends Document {
  id: string;
  name: string;
  images: [string];
  kcal: number;
  carbs: number;
  protein: number;
  fats: number;
  addedBy: UserDocument['id'];
  glycemicIndex: number;
  isVerified: boolean;
  inRecipes: [RecipeDocument['id']];
}
