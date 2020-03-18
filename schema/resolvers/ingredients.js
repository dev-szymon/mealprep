const Ingredient = require('../../models/Ingredient');

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
    newIngredient: (root, args, context, info) => {
      return Ingredient.create(args.ingredient);
    }
  }
};
