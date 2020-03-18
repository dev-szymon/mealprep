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
    }
  },
  User: {
    recipesCreated: (user, args, context, info) => {},
    recipesSaved: (user, args, context, info) => {},
    followers: (user, args, context, info) => {},
    following: (user, args, context, info) => {}
  }
};
