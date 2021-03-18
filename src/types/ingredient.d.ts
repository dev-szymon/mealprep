import { Document } from 'mongoose';
import { UserDocument } from './';

export interface IngredientDocument extends Document {
  id: string;
  addedBy: UserDocument['id'];
  isVerified: boolean;
  inRecipes: [RecipeDocument['id']];
  name: string;
  images: string[];
  kcal: number;
  carbs: number;
  protein: number;
  fats: number;
  glycemicIndex: number;
}

export interface IngredientChanges {
  name?: string;
  images?: string[];
  kcal?: number;
  carbs?: number;
  protein?: number;
  fats?: number;
  glycemicIndex?: number;
}
