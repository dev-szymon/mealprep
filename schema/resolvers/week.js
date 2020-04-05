const Week = require('../../models/Week');
const Meal = require('../../models/Meal');

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
      const createdMeal = await Meal.create(args);
      const { day, week, recipe } = args;
      await Week.updateOne(
        { _id: { $in: week } },
        {
          $push: { [day]: createdMeal },
        }
      );
      await Meal.updateOne(
        { _id: { $in: createdMeal } },
        { $set: { recipe: recipe } },
        { new: true, upsert: true }
      );
      return createdMeal;
    },
    removeMeal: async (root, args, context, info) => {
      // check if I have to pull from day first
      await Meal.deleteOne({ _id: { $in: args.meal } });
      return args.week;
    },
  },
  Week: {
    user: async (week, args, context, info) => {
      await week
        .populate({ path: 'user', populate: { path: 'user' } })
        .execPopulate();
      return week.user;
    },
    mon: async (week, args, context, info) => {
      await week
        .populate({ path: 'mon', populate: { path: 'mon' } })
        .execPopulate();
      return week.mon;
    },
    tue: async (week, args, context, info) => {
      await week
        .populate({ path: 'tue', populate: { path: 'tue' } })
        .execPopulate();
      return week.tue;
    },
    wed: async (week, args, context, info) => {
      await week
        .populate({ path: 'wed', populate: { path: 'wed' } })
        .execPopulate();
      return week.wed;
    },
    thu: async (week, args, context, info) => {
      await week
        .populate({ path: 'thu', populate: { path: 'thu' } })
        .execPopulate();
      return week.thu;
    },
    fri: async (week, args, context, info) => {
      await week
        .populate({ path: 'fri', populate: { path: 'fri' } })
        .execPopulate();
      return week.fri;
    },
    sat: async (week, args, context, info) => {
      await week
        .populate({ path: 'sat', populate: { path: 'sat' } })
        .execPopulate();
      return week.sat;
    },
    sun: async (week, args, context, info) => {
      await week
        .populate({ path: 'sun', populate: { path: 'sun' } })
        .execPopulate();
      return week.sun;
    },
  },
  Meal: {
    recipe: async (meal, args, context, info) => {
      await meal
        .populate({
          path: 'recipe',
          // populate: { path: 'recipe', populate: { path: 'recipe' } },
        })
        .execPopulate();
      return meal.recipe;
    },
  },
};
