const Recipe = require('../../models/Recipe');

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
    newRecipe: (root, args, context, info) => {
      return Recipe.create(args.recipe);
    }
  }
};
