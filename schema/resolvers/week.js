const Week = require('../../models/Week');
const Day = require('../../models/Day');
const Meal = require('../../models/Meal');
const Cart = require('../../models/Cart');
const Recipe = require('../../models/Recipe');

module.exports = {
  Query: {
    getWeek: (root, args, context, info) => {
      return Week.findById(args.id);
    },
    getMeal: (root, args, context, info) => {
      return Meal.findById(args.id);
    },
  },
  Mutation: {
    addMeal: async (root, args, context, info) => {
      const { day, recipe, label, cart } = args;
      const createdMeal = await Meal.create({
        day: day,
        recipe: recipe,
        label: label,
      });
      await Day.updateOne(
        { _id: { $in: day } },
        {
          $push: { meals: createdMeal },
        }
      );
      const { ingredients } = await Recipe.findById(recipe);

      // await Cart.updateOne(
      //   { _id: { $in: cart } },
      //   {
      //     $push: { products: { $each: ingredients } },
      //   }
      // );

      await Meal.updateOne(
        { _id: { $in: createdMeal } },
        { $set: { recipe: recipe } },
        { new: true, upsert: true }
      );
      return createdMeal;
    },
    removeMeal: async (root, args, context, info) => {
      // check if I have to pull from day first
      const { meal, cart } = args;
      const { recipe } = await Meal.findById(meal);
      const { ingredients } = await Recipe.findById(recipe);
      console.log(ingredients);
      // await Cart.findOneAndUpdate(
      //   { _id: { $in: cart } },
      //   { $pull: { products: ingredients } }
      // );
      // console.log(ingredients);
      await Meal.deleteOne({ _id: { $in: meal } });
      return args.week;
    },
  },
  Week: {
    owner: async (week, args, context, info) => {
      await week
        .populate({ path: 'user', populate: { path: 'user' } })
        .execPopulate();
      return week.user;
    },
    days: async (week, args, context, info) => {
      await week
        .populate({ path: 'days', populate: { path: 'days' } })
        .execPopulate();
      return week.days;
    },
  },
  Day: {
    inWeek: async (day, args, context, info) => {
      await day.populate({ path: 'inWeek' }).execPopulate();
      return day.inWeek;
    },
    meals: async (day, args, context, info) => {
      await day
        .populate({ path: 'meals', populate: { path: 'meals' } })
        .execPopulate();
      return day.meals;
    },
  },
  Meal: {
    recipe: async (meal, args, context, info) => {
      await meal.populate('recipe').execPopulate();
      return meal.recipe;
    },
  },
};
