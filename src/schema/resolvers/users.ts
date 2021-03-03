import { FilterRootFields, IResolvers } from 'apollo-server-express';
import { UserDocument } from '../../types';
import { User } from '../../models/User';
import { useryup } from '../validation';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Context } from '../../types';

interface LogIn {
  email: string;
  password: string;
}

const resolvers: IResolvers = {
  Query: {
    me: async (root, args, { user }: Context, info) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      try {
        return await User.findById(user);
      } catch (err) {
        throw new AuthenticationError('Please log in!');
      }
    },
    getUsers: async (root, args, context, info) => {
      return await User.find({}).limit(100);
    },
    getUserByUsername: async (
      root,
      { username }: { username: string | undefined },
      context,
      info
    ) => {
      return await User.findOne({ username: username });
    },
    getUserById: async (root, { id }: { id: string }, context, info) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    newUser: async (root, args: UserDocument, { req }, info) => {
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

      // create new User and return session
      const user = await User.create(args);
      try {
        req.session.sid = user.id;
        return user.id;
      } catch (err) {
        console.log(err);
        throw new Error('Error creating account');
      }
    },
    logIn: async (root, args: LogIn, { req }, info) => {
      const user = await User.findOne({ email: args.email });
      if (!user || !(await user.matchesPassword(args.password))) {
        throw new AuthenticationError(
          'Incorrect email or password, please try again'
        );
      }

      req.session.sid = user.id;

      return user.id;
    },
    logOut: (root, args, { req }, info) => {
      try {
        req.session.destroy();
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    toggleFollowUser: async (
      root,
      { followed }: { followed: string },
      { user }: Context,
      info
    ) => {
      if (!user) {
        throw new AuthenticationError('Please log in!');
      }

      const checkUser = await User.findById(user);

      if (!checkUser) {
        throw new AuthenticationError('Please log in!');
      }

      const isFollowing = checkUser.following.includes(followed);

      if (isFollowing) {
        await User.updateOne(
          { _id: followed },
          {
            $pull: { followers: user },
          }
        );
        await User.updateOne(
          { _id: user },
          {
            $pull: { following: followed },
          }
        );
      } else {
        await User.updateOne(
          { _id: followed },
          {
            $push: { followers: user },
          }
        );
        await User.updateOne(
          { _id: user },
          {
            $push: { following: followed },
          }
        );
      }

      return await User.findById(followed);
    },
  },
  User: {
    // -------------------------------------
    // info object is useful for populating
    // import graphqlFields from 'graphql-fields'
    // -------------------------------------
    recipesCreated: async (user: UserDocument, args, context, info) => {
      await user.populate('recipesCreated').execPopulate();
      return user.recipesCreated;
    },
    recipesSaved: async (user: UserDocument, args, context, info) => {
      await user.populate('recipesSaved').execPopulate();
      return user.recipesSaved;
    },
    ingredientsCreated: async (user: UserDocument, args, context, info) => {
      await user.populate('ingredientsCreated').execPopulate();
      return user.ingredientsCreated;
    },
    followers: async (user: UserDocument, args, context, info) => {
      await user.populate('followers').execPopulate();
      return user.followers;
    },
    following: async (user: UserDocument, args, context, info) => {
      await user.populate('following').execPopulate();
      return user.following;
    },
    liked: async (user: UserDocument, args, context, info) => {
      await user.populate('liked').execPopulate();
      return user.liked;
    },
  },
};

export default resolvers;
