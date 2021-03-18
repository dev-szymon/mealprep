import { IResolvers } from 'apollo-server-express';
import { Recipe } from '../../models/Recipe';
import { User } from '../../models/User';
import { Ingredient } from '../../models/Ingredient';
import { recipeyup } from '../validation';
import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} from 'apollo-server-express';
import { paginatedQuery } from '../../utils';
import { Context, RecipeDocument } from '../../types';

const resolvers: IResolvers = {
  Query: {
    getRecipe: (root, { id }: { id: string }, context, info) => {
      return Recipe.findById(id);
    },
    getRecipes: (root, args, context, info) => {
      return Recipe.find({}).limit(100);
    },
    recipeFeed: async (root, { cursor }: { cursor: string }, context, info) => {
      return paginatedQuery(Recipe, 10, cursor);
    },
  },
  Mutation: {
    newRecipe: async (
      root,
      { recipe }: { recipe: RecipeDocument },
      { user }: Context,
      info
    ) => {
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
        const { ingredients } = recipe;

        const totalKcal = (
          await Ingredient.find({ _id: { $in: ingredients } })
        ).reduce((acc, i) => {
          return acc + i.kcal;
        }, 0);

        console.log(totalKcal);

        const createdRecipe = await Recipe.create({
          ...recipe,
          createdBy: user,
          kcal: totalKcal,
        });

        await Ingredient.updateMany(
          { _id: { $in: ingredients } },
          {
            $push: { inRecipes: createdRecipe },
          }
        );

        await User.updateOne(
          { _id: user },
          { $push: { recipesCreated: createdRecipe.id } }
        );
        return createdRecipe;
      } catch (err) {
        console.log(err);

        throw new Error('Error creating ingredient');
      }
    },
    deleteRecipe: async (root, { id }: { id: string }, { user }, info) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      try {
        const recipe = await Recipe.findOne({ _id: id });

        // check if user sending request has required permissions
        if (recipe && String(recipe.createdBy) !== user) {
          throw new ForbiddenError('Forbidden request');
        }

        await Recipe.deleteOne({ _id: id });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    updateRecipe: async (
      root,
      { recipe, changes },
      { user }: Context,
      info
    ) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      const updatedRecipe = await Recipe.findById(recipe);

      // if the note owner and current user don't match, throw a forbidden error
      if (updatedRecipe && String(updatedRecipe.createdBy) !== user) {
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
    toggleSaveRecipe: async (
      root,
      { recipe }: { recipe: RecipeDocument['id'] },
      { user }: Context,
      info
    ) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      const currentUser = await User.findById(user);

      if (!currentUser) {
        throw new AuthenticationError('Please log in!');
      }

      const isSaved = currentUser.recipesSaved.includes(recipe);

      if (isSaved) {
        await Recipe.updateOne(
          { _id: recipe },
          {
            $pull: { cookbooked: user },
          }
        );
        return await User.findOneAndUpdate(
          { _id: user },
          {
            $pull: { recipesSaved: recipe },
          },
          { new: true }
        );
      } else {
        await Recipe.updateOne(
          { _id: recipe },
          {
            $push: { cookbooked: user },
          }
        );
        return await User.findOneAndUpdate(
          { _id: user },
          {
            $push: { recipesSaved: recipe },
          },
          { new: true }
        );
      }
    },
    toggleLikeRecipe: async (
      root,
      { recipe }: { recipe: RecipeDocument['id'] },
      { user },
      info
    ) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      const currentUser = await User.findById(user);

      if (!currentUser) {
        throw new AuthenticationError('PLease log in!');
      }

      const isLiked = currentUser.liked.includes(recipe);

      if (isLiked) {
        await Recipe.updateOne(
          { _id: recipe },
          {
            $pull: { likes: user },
          }
        );
        return await User.findOneAndUpdate(
          { _id: user },
          {
            $pull: { liked: recipe },
          },
          {
            new: true,
          }
        );
      } else {
        await Recipe.updateOne(
          { _id: recipe },
          {
            $push: { likes: user },
          }
        );
        return await User.findOneAndUpdate(
          { _id: user },
          {
            $push: { liked: recipe },
          },
          {
            new: true,
          }
        );
      }
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
  },
};

export default resolvers;
