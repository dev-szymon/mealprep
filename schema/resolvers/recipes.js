const Recipe = require('../../models/Recipe');
const User = require('../../models/User');
const Ingredient = require('../../models/Ingredient');
const recipeyup = require('../validation');
const {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} = require('apollo-server-express');

module.exports = {
  Query: {
    getRecipe: (root, { id }, context, info) => {
      return Recipe.findById(id);
    },
    getRecipes: (root, args, context, info) => {
      return Recipe.find({}).limit(100);
    },
  },
  Mutation: {
    newRecipe: async (root, { recipe }, { user }, info) => {
      const message = 'Invalid input, please try again';

      // validate data provided by the User
      try {
        await recipeyup.validate(recipe, { abortEarly: false });
      } catch (err) {
        throw new UserInputError(message);
      }

      // Creates new recipe and pushes it to ingredients inRecipes array
      const createdRecipe = await Recipe.create({
        ...recipe,
        createdBy: user.id,
      });
      const { ingredients } = recipe;
      await Ingredient.updateMany(
        { _id: { $in: ingredients } },
        {
          $push: { inRecipes: createdRecipe },
        }
      );

      await User.updateOne(
        { _id: user.id },
        { $push: { recipesCreated: createdRecipe } }
      );
      return createdRecipe;
    },
    deleteRecipe: async (root, { id }, context, info) => {
      try {
        await Recipe.deleteOne({ _id: id });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    updateRecipe: async (root, { recipe, changes }, { user }, info) => {
      const updatedRecipe = await Recipe.findById(recipe);

      // if the note owner and current user don't match, throw a forbidden error
      if (String(updatedRecipe.createdBy) !== user.id) {
        throw new ForbiddenError(
          `You don't have permissions to update the recipe`
        );
      }

      // Update the note in the db and return the updated note
      return await Recipe.findOneAndUpdate(
        {
          _id: recipe,
        },
        {
          $set: {
            ...changes,
          },
        },
        {
          new: true,
        }
      );
    },
    toggleSaveRecipe: async (root, { recipe }, { user }, info) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      const checkUser = await User.findById(user.id);
      const isSaved = checkUser.recipesSaved.includes(recipe);

      if (isSaved) {
        await Recipe.updateOne(
          { _id: recipe },
          {
            $pull: { cookBooked: user.id },
          }
        );
        await User.updateOne(
          { _id: user.id },
          {
            $pull: { recipesSaved: recipe },
          }
        );
      } else {
        await Recipe.updateOne(
          { _id: recipe },
          {
            $push: { cookBooked: user.id },
          }
        );
        await User.updateOne(
          { _id: user.id },
          {
            $push: { recipesSaved: recipe },
          }
        );
      }

      return await Recipe.findById(recipe);
    },
    toggleLikeRecipe: async (root, { recipe }, { user }, info) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      const checkUser = await User.findById(user.id);
      const isSaved = checkUser.liked.includes(recipe);

      if (isSaved) {
        await Recipe.updateOne(
          { _id: recipe },
          {
            $pull: { likes: user.id },
          }
        );
        await User.updateOne(
          { _id: user.id },
          {
            $pull: { liked: recipe },
          }
        );
      } else {
        await Recipe.updateOne(
          { _id: recipe },
          {
            $push: { likes: user.id },
          }
        );
        await User.updateOne(
          { _id: user.id },
          {
            $push: { liked: recipe },
          }
        );
      }

      return await Recipe.findById(recipe);
    },
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
          populate: { path: 'cookBooked' },
        })
        .execPopulate();
      return recipe.cookBooked;
    },
    likes: async (recipe, args, context, info) => {
      await recipe
        .populate({
          path: 'likes',
          populate: { path: 'likes' },
        })
        .execPopulate();
      return recipe.likes;
    },
  },
};
