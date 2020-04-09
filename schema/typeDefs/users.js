const { gql } = require('apollo-server-express');

// add logout mutation
module.exports = User = gql`
  extend type Query {
    me(userId: ID!): User
    getUsers: [User]!
    getUser(id: ID!): User
  }

  extend type Mutation {
    newUser(username: String!, email: String!, password: String!): User
    logIn(email: String!, password: String!): User
    followUser(loggedIn: ID!, followedId: ID!): User
    unfollowUser(loggedIn: ID!, followedId: ID!): User
  }

  type User {
    id: ID!
    username: String!
    email: String!
    mealPlan: Week
    recipesCreated: [Recipe]!
    recipesSaved: [Recipe]!
    liked: [Recipe]!
    followers: [User]!
    following: [User]!
  }
`;
