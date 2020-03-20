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
      await User.update(
        { _id: { $in: createdRecipe.createdBy } },
        { $push: { recipesCreated: createdRecipe } }
      );
      return createdRecipe;
    },
    saveRecipe: async (root, args, context, info) => {
      const { loggedIn, recipeId } = args;
      await User.update(
        { _id: { $in: loggedIn } },
        { $push: { recipesSaved: recipeId } }
      );
    },
    unsaveRecipe: async (root, args, context, info) => {}
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
    }
  }
};
