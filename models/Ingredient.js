const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IngredientSchema = new Schema(
  {
    name: String,
    fats: Number,
    carbs: Number,
    fibres: Number,
    kcal: Number,
    inRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
  },
  { timestamps: true }
);

const Ingredient = mongoose.model('ingredient', IngredientSchema);

module.exports = Ingredient;
