import { IResolvers } from 'apollo-server-express'
import {Ingredient} from '../../models/Ingredient';
import {User} from '../../models/User';
import { UserInputError, ForbiddenError } from 'apollo-server-express';
import { ingredientyup } from '../validation';
import {paginatedQuery} from '../../utils';

const resolvers: IResolvers = {
  Query: {
    getIngredient: (root, { id }, context, info) => {
      return Ingredient.findById(id);
    },

    getIngredientByName: async (root, { name }, context, info) => {
      return await Ingredient.find({ name: new RegExp(name, 'i') }).limit(100);
    },
    getIngredients: (root, args, context, info) => {
      return Ingredient.find({}).limit(100);
    },
    recipeFeed: async (root, { cursor }, context, info) => {
      return paginatedQuery(Ingredient, 10, cursor);
    },
  },
  Mutation: {
    newIngredient: async (root, { ingredient }, { user }, info) => {
      // validate data provided by the User
      try {
        await ingredientyup.validate(ingredient, { abortEarly: false });
      } catch (err) {
        console.log(err.message);
        throw new UserInputError('Invalid input, please try again');
      }

      // check if ingredient exists
      if (await Ingredient.findOne({ name: ingredient.name })) {
        throw new UserInputError('Ingredient already exists.');
      }

      try {
        const createdIngredient = await Ingredient.create({
          ...ingredient,
          addedBy: user,
        });

        await User.updateOne(
          { _id: user },
          { $push: { ingredientsCreated: createdIngredient } }
        );

        return createdIngredient;
      } catch (err) {
        console.log(err);
        throw new Error('Error creating ingredient');
      }
    },
    updateIngredient: async (root, { ingredient, changes }, { user }, info) => {
      const updatedIngredient = await Ingredient.findById(ingredient);

      // if the owner and current user don't match, throw a forbidden error
      if (updatedIngredient && String(updatedIngredient.addedBy) !== user.id) {
        throw new ForbiddenError(
          `You don't have permissions to update the ingredient`
        );
      }

      // Update the ingredient in the db and return the updated ingredient
      return await Ingredient.findOneAndUpdate(
        {
          _id: ingredient,
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
    verifyIngredient: async (root, { ingredient }, { user }, info) => {
      const checkUser = await User.findById(user.id);
      if (checkUser && checkUser.accountLevel < 2) {
        throw new ForbiddenError(
          `You don't have permissions to verify the ingredient`
        );
      }

      return await Ingredient.findOneAndUpdate(
        { _id: ingredient },
        { $set: { isVerified: true } },
        { new: true }
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
    addedBy: async (ingredient, args, context, info) => {
      await ingredient.populate({ path: 'addedBy' }).execPopulate();
      return ingredient.addedBy;
    },
  },
};

export default resolvers