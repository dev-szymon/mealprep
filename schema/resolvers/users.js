const User = require('../../models/User');
const useryup = require('../validation/user');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Query: {
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
      try {
        await useryup.validate(args, { abortEarly: false });
      } catch (err) {
        console.log(err);
      }

      return createdUser;
    },
    logIn: async (root, args, context, info) => {
      const message = 'Incorrect email or password, please try again';
      const user = await User.findOne({ email: args.email });
      if (!user || !(await user.matchesPassword(args.password))) {
        throw new AuthenticationError(message);
      }
      return user;
    },
    toggleFollowUser: async (root, args, context, info) => {
      // implement toggle logic
      const { user, followed } = args;
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
  },
};
