const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IngredientSchema = new Schema(
  {
    name: String,
    fats: Number,
    carbs: Number,
    protein: Number,
    kcal: Number,
    inRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  { timestamps: true }
);

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = Ingredient;
