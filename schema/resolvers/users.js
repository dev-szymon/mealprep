const User = require('../../models/User');
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
    }
  },
  Mutation: {
    newUser: (root, args, context, info) => {
      return User.create(args);
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
    followUser: async (root, args, context, info) => {
      const { followedId, loggedIn } = args;
      await User.update(
        { _id: { $in: followedId } },
        {
          $push: { followers: loggedIn }
        }
      );
      await User.update(
        { _id: { $in: loggedIn } },
        {
          $push: { followed: followedId }
        }
      );
    },

    unfollowUser: async (root, args, context, info) => {}
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
    }
  }
};
