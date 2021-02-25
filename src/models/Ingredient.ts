import {model, Schema} from 'mongoose';
import {IngredientDocument} from '../types'


const IngredientSchema = new Schema(
  {
    name: String,
    images: [String],
    kcal: Number,
    carbs: Number,
    protein: Number,
    fats: Number,
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    glycemicIndex: Number,
    isVerified: { type: Boolean, default: false },
    inRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  { timestamps: true }
);

export const Ingredient = model<IngredientDocument>('Ingredient', IngredientSchema);

