const Recipe = require('../../models/Recipe');
const User = require('../../models/User');
const Ingredient = require('../../models/Ingredient');
const recipeyup = require('../validation');
const {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} = require('apollo-server-express');
const { paginatedQuery } = require('../../utils');

module.exports = {
  Query: {
    getRecipe: (root, { id }, context, info) => {
      return Recipe.findById(id);
    },
    getRecipes: (root, args, context, info) => {
      return Recipe.find({}).limit(100);
    },
    recipeFeed: async (root, { cursor }, context, info) => {
      return paginatedQuery(Recipe, 10, cursor);
    },
  },
  Mutation: {
    newRecipe: async (root, { recipe }, { user }, info) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      // validate data provided by the User
      try {
        await recipeyup.validate(recipe, { abortEarly: false });
      } catch (err) {
        throw new UserInputError('Invalid input, please try again');
      }

      if (await Recipe.findOne({ name: recipe.name })) {
        throw new UserInputError('Recipe already exists.');
      }

      // Creates new recipe and pushes it to ingredients inRecipes array
      try {
        const createdRecipe = await Recipe.create({
          ...recipe,
          createdBy: user,
        });
        const { ingredients } = recipe;
        await Ingredient.updateMany(
          { _id: { $in: ingredients } },
          {
            $push: { inRecipes: createdRecipe },
          }
        );

        await User.updateOne(
          { _id: user },
          { $push: { recipesCreated: createdRecipe } }
        );
        return createdRecipe;
      } catch (err) {
        console.log(err);

        throw new Error('Error creating ingredient');
      }
    },
    deleteRecipe: async (root, { id }, { user }, info) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      try {
        const recipe = await Recipe.findOne({ _id: id });

        // check if user sending request has required permissions
        if (String(recipe.createdBy) !== user) {
          throw new ForbiddenError('Forbidden request');
        }

        await Recipe.deleteOne({ _id: id });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    updateRecipe: async (root, { recipe, changes }, { user }, info) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      const updatedRecipe = await Recipe.findById(recipe);

      // if the note owner and current user don't match, throw a forbidden error
      if (String(updatedRecipe.createdBy) !== user) {
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
            $pull: { cookbooked: user.id },
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
            $push: { cookbooked: user.id },
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
    cookbooked: async (recipe, args, context, info) => {
      await recipe
        .populate({
          path: 'cookbooked',
          populate: { path: 'cookbooked' },
        })
        .execPopulate();
      return recipe.cookbooked;
    },
    ingredients: async (recipe, args, context, info) => {
      // in order to populate an array you have to go deeper
      await recipe
        .populate({ path: 'ingredients', populate: { path: 'ingredients' } })
        .execPopulate();
      return recipe.ingredients;
    },
    cookbookedNumber: (recipe, args, context, info) => {
      return recipe.cookbooked.length;
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
    likesNumber: (recipe, args, context, info) => {
      return recipe.likes.length;
    },
    // should I implement kcal calculation here or during newRecipe mutation or on client side?
    // There is a plan to make it possible to swap ingredients during creating mealplan so this needs to be considered
    // might move it to either mutations or client in te future
    // calculations here are heavier on queries, but it's easier to maintain changes or update recipes

    kcal: async (recipe, args, context, info) => {
      const kcalArr = [];
      const ingredients = await Ingredient.find({
        _id: { $in: recipe.ingredients },
      });

      ingredients.map((i) => kcalArr.push(i.kcal));

      return kcalArr.reduce((a, b) => {
        const sum = a + b;
        return sum;
      });
    },
  },
};
