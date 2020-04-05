const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const RecipeSchema = new Schema(
  {
    name: String,
    createdBy: { type: ObjectId, ref: 'User' },
    public: Boolean,
    ingredients: [{ type: ObjectId, ref: 'Ingredient' }],
    description: String,
    prepTime: Number,
    cookBooked: [{ type: ObjectId, ref: 'User' }],
    likes: [{ type: ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
