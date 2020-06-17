const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IngredientSchema = new Schema(
  {
    name: String,
    images: [String],
    kcal: Number,
    carbs: Number,
    protein: Number,
    fats: Number,
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    glycemixIndex: Number,
    isVerified: { type: Boolean, default: false },
    tips: [String],
    inRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  { timestamps: true }
);

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = Ingredient;
