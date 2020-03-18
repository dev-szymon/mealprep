const mongoose = require('mongoose');
const User = require('./User');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const RecipeSchema = new Schema(
  {
    name: String,
    createdBy: [{ type: ObjectId, ref: 'User' }],
    ingredients: [{ type: ObjectId, ref: 'Ingredient' }],
    prepTime: Number,
    cookBooked: [{ type: ObjectId, ref: 'User' }],
    likes: [{ type: ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Recipe = mongoose.model('recipe', RecipeSchema);

module.exports = Recipe;
