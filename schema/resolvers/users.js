const User = require('../../models/User');
const Week = require('../../models/Week');
const Day = require('../../models/Day');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Query: {
    //   context is req
    me: (root, args, context, info) => {
      // checks the ID of logged in user
      return User.findById(args.userId);
    },
    getUsers: (root, args, context, info) => {
      // if can't find return user can no longer be found
      return User.find({});
    },
    getUser: (root, args, context, info) => {
      return User.findById(args.id);
    },
  },
  Mutation: {
    newUser: async (root, args, context, info) => {
      const createdUser = await User.create(args);

      const createdWeek = await Week.create({ user: createdUser, days: [] });
      await User.updateOne(
        { _id: createdUser },
        { $set: { mealPlan: createdWeek } },
        { upsert: true, new: true }
      );

      // getWeek returns array of dates of current week starting from previous sunday
      function getWeek(fromDate) {
        var sunday = new Date(
            fromDate.setDate(fromDate.getDate() - fromDate.getDay())
          ),
          result = [new Date(sunday)];
        while (sunday.setDate(sunday.getDate() + 1) && sunday.getDay() !== 0) {
          result.push(new Date(sunday));
        }
        return result;
      }

      const date = new Date();

      // creates days for each day of the current week, pushes them to the users week
      const createDays = async () => {
        getWeek(date).map(async (d) => {
          const createdDay = await Day.create({
            inWeek: createdWeek,
            meals: [],
            date: d,
          });
          await Week.updateOne(
            { _id: createdWeek },
            { $push: { days: createdDay } },
            { upsert: true, new: true }
          );
        });
        // );
      };
      createDays();
      return createdUser;
    },
    logIn: async (root, args, context, info) => {
      // probably need to modularise
      const message = 'Incorrect email or password, please try again';
      const user = await User.findOne({ email: args.email });
      if (!user || !(await user.matchesPassword(args.password))) {
        throw new AuthenticationError(message);
      }
      return user;
    },
    // add check if user is not already following
    followUser: async (root, args, context, info) => {
      const { followedId, loggedIn } = args;
      await User.updateOne(
        { _id: { $in: followedId } },
        {
          $push: { followers: loggedIn },
        }
      );
      await User.updateOne(
        { _id: { $in: loggedIn } },
        {
          $push: { following: followedId },
        }
      );
      return await User.findById(followedId);
    },
    unfollowUser: async (root, args, context, info) => {
      const { followedId, loggedIn } = args;
      await User.updateOne(
        { _id: { $in: followedId } },
        {
          $pull: { followers: loggedIn },
        }
      );
      await User.updateOne(
        { _id: { $in: loggedIn } },
        {
          $pull: { following: followedId },
        }
      );
      return await User.findById(followedId);
    },
  },
  User: {
    recipesCreated: async (user, args, context, info) => {
      await user.populate('recipesCreated').execPopulate();
      return user.recipesCreated;
    },
    recipesSaved: async (user, args, context, info) => {
      await user.populate('recipesSaved').execPopulate();
      return user.recipesSaved;
    },
    followers: async (user, args, context, info) => {
      await user.populate('followers').execPopulate();
      return user.followers;
    },
    following: async (user, args, context, info) => {
      await user.populate('following').execPopulate();
      return user.following;
    },
    liked: async (user, args, context, info) => {
      await user.populate('liked').execPopulate();
      return user.liked;
    },
    mealPlan: async (user, args, context, info) => {
      await user.populate({ path: 'mealPlan' }).execPopulate();
      return user.mealPlan;
    },
  },
};
