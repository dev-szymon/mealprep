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
    inWeek: (day, args, context, info) => {
      day.populate({ path: 'inWeek' }).execPopulate();
      return day.inWeek;
    },
    meals: (day, args, context, info) => {
      day
        .populate({ path: 'meals', populate: { path: 'meals' } })
        .execPopulate();
      return day.meals;
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
