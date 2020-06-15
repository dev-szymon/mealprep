const Ingredient = require('../../models/Ingredient');
const User = require('../../models/User');
const { UserInputError, ForbiddenError } = require('apollo-server-express');
const recipeyup = require('../validation');

module.exports = {
  Query: {
    getIngredient: (root, { id }, context, info) => {
      return Ingredient.findById(id);
    },
    getIngredients: (root, args, context, info) => {
      return Ingredient.find({});
    },
  },
  Mutation: {
    newIngredient: async (root, { ingredient }, { user }, info) => {
      const message = 'Invalid input, please try again';

      // validate data provided by the User
      try {
        await ingredientyup.validate(ingredient, { abortEarly: false });
      } catch (err) {
        throw new UserInputError(message);
      }

      // check if ingredient exists
      if (await Ingredient.findOne({ name: ingredient.name })) {
        throw new UserInputError('Ingredient already exists.');
      }
      try {
        return Ingredient.create({ ...ingredient, addedBy: user.id });
      } catch (err) {
        console.log(err);
        throw new Error('Error creating ingredient');
      }
    },
    updateIngredient: async (root, { ingredient, changes }, { user }, info) => {
      const updatedIngredient = await Ingredient.findById(ingredient);

      // if the note owner and current user don't match, throw a forbidden error
      if (updatedIngredient.addedBy !== user.id) {
        throw new ForbiddenError(
          `You don't have permissions to update the ingredient`
        );
      }

      // Update the note in the db and return the updated note
      return await Ingredient.findOneAndUpdate(
        {
          _id: ingredient,
        },
        {
          $set: {
            changes,
          },
        },
        {
          new: true,
        }
      );
    },
    verifyIngredient: async (root, { ingredient }, { user }, info) => {
      const checkUser = await User.findById(user.id);
      if (checkUser.accountLevel < 2) {
        throw new ForbiddenError(
          `You don't have permissions to verify the ingredient`
        );
      }

      return await Ingredient.findOneAndUpdateOne(
        { _id: ingredient },
        { $set: { isVerified: true } }
      );
    },
  },
  Ingredient: {
    inRecipes: async (ingredient, args, context, info) => {
      await ingredient
        .populate({ path: 'inRecipes', populate: { path: 'inRecipes' } })
        .execPopulate();
      return ingredient.inRecipes;
    },
  },
};
