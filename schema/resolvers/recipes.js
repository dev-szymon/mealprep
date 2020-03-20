const Recipe = require('../../models/Recipe');
const User = require('../../models/User');
const Ingredient = require('../../models/Ingredient');

module.exports = {
  Query: {
    getRecipe: (root, args, context, info) => {
      return Recipe.findById(args.id);
    },
    getRecipes: (root, args, context, info) => {
      return Recipe.find({});
    }
  },
  Mutation: {
    newRecipe: async (root, args, context, info) => {
      // Creates new recipe and pushes it to ingredients inRecipes array
      const createdRecipe = await Recipe.create(args.recipe);
      const { ingredients } = args.recipe;
      await Ingredient.updateMany(
        { _id: { $in: ingredients } },
        {
          $push: { inRecipes: createdRecipe }
        }
      );
      // push created recipe to author's recipeCreated
      await User.updateOne(
        { _id: { $in: createdRecipe.createdBy } },
        { $push: { recipesCreated: createdRecipe } }
      );
      return createdRecipe;
    },
    // TODO check if they are not saved yet
    saveRecipe: async (root, args, context, info) => {
      const { loggedIn, recipeId } = args;
      await User.updateOne(
        { _id: { $in: loggedIn } },
        { $push: { recipesSaved: recipeId } }
      );
      await Recipe.updateOne(
        { _id: { $in: recipeId } },
        { $push: { cookBooked: loggedIn } }
      );
      return await Recipe.findById(recipeId);
    },
    unsaveRecipe: async (root, args, context, info) => {
      const { loggedIn, recipeId } = args;
      await User.updateOne(
        { _id: { $in: loggedIn } },
        { $pull: { recipesSaved: recipeId } }
      );
      await Recipe.updateOne(
        { _id: { $in: recipeId } },
        { $pull: { cookBooked: loggedIn } }
      );
      return await Recipe.findById(recipeId);
    },
    likeRecipe: async (root, args, context, info) => {
      const { loggedIn, recipeId } = args;
      await User.updateOne(
        { _id: { $in: loggedIn } },
        { $push: { liked: recipeId } }
      );
      await Recipe.updateOne(
        { _id: { $in: recipeId } },
        { $push: { likes: loggedIn } }
      );
      return await Recipe.findById(recipeId);
    },
    unlikeRecipe: async (root, args, context, info) => {
      const { loggedIn, recipeId } = args;
      await User.updateOne(
        { _id: { $in: loggedIn } },
        { $pull: { liked: recipeId } }
      );
      await Recipe.updateOne(
        { _id: { $in: recipeId } },
        { $pull: { likes: loggedIn } }
      );
      return await Recipe.findById(recipeId);
    }
  },
  Recipe: {
    // populates recipes with user models from mongoose, as described in model schema
    createdBy: async (recipe, args, context, info) => {
      await recipe.populate('createdBy').execPopulate();
      return recipe.createdBy;
    },
    ingredients: async (recipe, args, context, info) => {
      // in order to populate an array you have to go deeper
      await recipe
        .populate({ path: 'ingredients', populate: { path: 'ingredients' } })
        .execPopulate();
      return recipe.ingredients;
    },
    cookBooked: async (recipe, args, context, info) => {
      await recipe
        .populate({
          path: 'cookBooked',
          populate: { path: 'cookBooked' }
        })
        .execPopulate();
      return recipe.cookBooked;
    },
    likes: async (recipe, args, context, info) => {
      await recipe
        .populate({
          path: 'likes',
          populate: { path: 'likes' }
        })
        .execPopulate();
      return recipe.likes;
    }
  }
};
