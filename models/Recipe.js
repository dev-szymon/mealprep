const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const RecipeSchema = new Schema(
  {
    name: String,
    images: [String],
    createdBy: { type: ObjectId, ref: 'User' },
    public: Boolean,
    tags: [String],
    ingredients: [{ type: ObjectId, ref: 'Ingredient' }],
    description: String,
    prepTime: Number,
    cookbooked: [{ type: ObjectId, ref: 'User' }],
    cookbookedNumber: Number,
    likes: [{ type: ObjectId, ref: 'User' }],
    likesNumber: Number,
    kcal: Number,
  },
  { timestamps: true }
);

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
