const User = require('../../models/User');
const Week = require('../../models/Week');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Query: {
    //   context is req
    me: (root, args, context, info) => {
      // checks the ID of logged in user
      return User.findById();
    },
    getUsers: (root, args, context, info) => {
      return User.find({});
    },
    getUser: (root, args, context, info) => {
      return User.findById(args.id);
    },
  },
  Mutation: {
    newUser: async (root, args, context, info) => {
      // problems with creating week
      const createdUser = await User.create(args);
      const createdWeek = await Week.create({ user: createdUser });
      await User.updateOne(
        { _id: createdUser },
        { $set: { mealPlan: createdWeek } },
        { upsert: true, new: true }
      );
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
      await user
        .populate({ path: 'mealPlan', populate: { path: 'mealPlan' } })
        .execPopulate();
      return user.mealPlan;
    },
  },
};
