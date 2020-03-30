const Dayplan = require('../../models/Dayplan');
const User = require('../../models/User');
const Meal = require('../../models/Meal');

module.exports = {
  Query: {
    getDay: (root, args, context, info) => {
      return Dayplan.findById(args.id);
    },
    getMeal: (root, args, context, info) => {
      return Meal.findById(args.id);
    }
  },
  Mutation: {
    newDay: async (root, args, context, info) => {
      const createdDay = await Dayplan.create(args);
      await User.updateOne(
        { _id: { $in: args.createdBy } },
        {
          $push: { mealPlan: createdDay }
        },
        { upsert: true }
      );
      return createdDay;
    },
    swapDays: async (root, args, context, info) => {},
    addMeal: async (root, args, context, info) => {
      const createdMeal = await Meal.create(args);
      await Dayplan.updateOne(
        { _id: { $in: args.dayID } },
        {
          $push: { meals: createdMeal }
        }
      );
      return Dayplan.findById(args.dayID);
    },
    removeMeal: async (root, args, context, info) => {
      // check if I have to pull from day first
      await Meal.deleteOne({ _id: { $in: args.mealID } });
      return dayID;
    },
    swapLabels: async (root, args, context, info) => {}
  },
  Day: {
    meals: async (dayplan, args, context, info) => {
      await dayplan
        .populate({ path: 'meals', populate: { path: 'meals' } })
        .execPopulate();
      return dayplan.meals;
    },
    createdBy: async (dayplan, args, context, info) => {
      await dayplan.populate('createdBy').execPopulate();
      return dayplan.createdBy;
    }
  },
  Meal: {
    recipe: async (meal, args, context, info) => {
      await meal.populate('recipe').execPopulate();
      return meal.recipe;
    }
  }
};
