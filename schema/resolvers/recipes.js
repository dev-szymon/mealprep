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
      // doesnt work,
      const { ingredients } = args.recipe;
      const justCreatedRecipe = await Recipe.create(args.recipe);
      await ingredients.map(i =>
        Ingredient.findOneAndUpdate(
          { id: i },
          { $push: { inRecipes: { name: 'test' } } }
        )
      );
      return justCreatedRecipe;
    }
  },
  Recipe: {
    // populates recipes with user models from mongoose
    createdBy: async (recipe, args, context, info) => {
      await recipe.populate('createdBy').execPopulate();
      return recipe.createdBy;
    },
    ingredients: async (recipe, args, context, info) => {
      // populate array you have to go deeper
      await recipe
        .populate({ path: 'ingredients', populate: { path: 'ingredients' } })
        .execPopulate();
      return recipe.ingredients;
    }
  }
};
