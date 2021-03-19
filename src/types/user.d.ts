import { Document } from 'mongoose';
import { RecipeDocument, IngredientDocument } from '.';

export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  accountLevel: number;
  recipesCreated: [RecipeDocument['id']];
  recipesSaved: [RecipeDocument['id']];
  ingredientsCreated: [IngredientDocument['id']];
  liked: [RecipeDocument['id']];
  followers: [UserDocument['id']];
  following: [UserDocument['id']];
  matchesPassword: (password: string) => Promise<boolean>;
}
