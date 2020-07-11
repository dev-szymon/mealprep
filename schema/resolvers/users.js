const User = require('../../models/User');
const useryup = require('../validation');
const {
  AuthenticationError,
  UserInputError,
} = require('apollo-server-express');
const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} = require('../../auth');

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
    newUser: async (root, args, { res }, info) => {
      // validate data provided by the User
      try {
        await useryup.validate(args, { abortEarly: false });
      } catch (err) {
        throw new UserInputError('Invalid input, please try again');
      }

      const checkUsername = await User.findOne({ username: args.username });
      const checkEmail = await User.findOne({ email: args.email });

      if (checkUsername) {
        throw new UserInputError('Username is already taken.');
      }
      if (checkEmail) {
        throw new UserInputError('Email is already taken.');
      }

      // create new User and return JWT and refreshJWT
      const user = await User.create(args);
      try {
        sendRefreshToken(res, createRefreshToken(user));
        return createAccessToken(user);
      } catch (err) {
        console.log(err);
        throw new Error('Error creating account');
      }
    },
    logIn: async (root, args, { res }, info) => {
      const user = await User.findOne({ email: args.email });
      if (!user || !(await user.matchesPassword(args.password))) {
        throw new AuthenticationError(
          'Incorrect email or password, please try again'
        );
      }

      try {
        sendRefreshToken(res, createRefreshToken(user));
      } catch (err) {
        console.log(err);
      }
      const token = createAccessToken(user);
      return token;
    },
    // increment token version
    forgotPassword: async (root, { id }, context, info) => {
      try {
        await User.updateOne(
          { _id: id },
          {
            $inc: { tokenVersion: 1 },
          }
        );
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
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
