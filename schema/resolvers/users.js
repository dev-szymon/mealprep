const User = require('../../models/User');
const useryup = require('../validation');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  UserInputError,
} = require('apollo-server-express');

module.exports = {
  Query: {
    me: async (root, args, { user }, info) => {
      try {
        return await User.findById(user.id);
      } catch (err) {
        throw new AuthenticationError('Please log in!');
      }
    },
    getUsers: async (root, args, context, info) => {
      return await User.find({}).limit(100);
    },
    getUserByUsername: async (root, { username }, context, info) => {
      return await User.findOne({ username: username });
    },
    getUserById: async (root, args, { id }, info) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    newUser: async (root, args, context, info) => {
      const message = 'Invalid input, please try again';

      // validate data provided by the User
      try {
        await useryup.validate(args, { abortEarly: false });
      } catch (err) {
        throw new UserInputError(message);
      }

      // create new User and return JWT
      try {
        const createdUser = await User.create(args);
        return jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
      } catch (err) {
        console.log(err);
        throw new Error('Error creating account');
      }
    },
    logIn: async (root, args, context, info) => {
      const message = 'Incorrect email or password, please try again';
      const user = await User.findOne({ email: args.email });
      if (!user || !(await user.matchesPassword(args.password))) {
        throw new AuthenticationError(message);
      }
      return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
    },
    toggleFollowUser: async (root, { followed }, { user }, info) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      const checkUser = await User.findById(user.id);
      const isFollowing = checkUser.following.includes(followed);

      if (isFollowing) {
        await User.updateOne(
          { _id: followed },
          {
            $pull: { followers: user.id },
          }
        );
        await User.updateOne(
          { _id: user.id },
          {
            $pull: { following: followed },
          }
        );
      } else {
        await User.updateOne(
          { _id: followed },
          {
            $push: { followers: user.id },
          }
        );
        await User.updateOne(
          { _id: user.id },
          {
            $push: { following: followed },
          }
        );
      }

      return await User.findById(followed);
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
