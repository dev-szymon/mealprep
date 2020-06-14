const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IngredientSchema = new Schema(
  {
    name: String,
    photo: String,
    kcal: Number,
    carbs: Number,
    protein: Number,
    fats: Number,
    glycemixIndex: Number,
    tips: [String],
    inRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  { timestamps: true }
);

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = Ingredient;
