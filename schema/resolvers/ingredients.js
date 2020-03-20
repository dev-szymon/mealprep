const Ingredient = require('../../models/Ingredient');
const { UserInputError } = require('apollo-server-express');

module.exports = {
  Query: {
    getIngredient: (root, args, context, info) => {
      return Ingredient.findById(args.id);
    },
    getIngredients: (root, args, context, info) => {
      return Ingredient.find({});
    }
  },
  Mutation: {
    newIngredient: async (root, args, context, info) => {
      if (await Ingredient.findOne({ name: args.ingredient.name })) {
        throw new UserInputError('Ingredient already exists.');
      }
      return Ingredient.create(args.ingredient);
    }
  },
  Ingredient: {
    inRecipes: async (ingredient, args, context, info) => {
      await ingredient
        .populate({ path: 'inRecipes', populate: { path: 'inRecipes' } })
        .execPopulate();
      return ingredient.inRecipes;
    }
  }
};
