const { gql } = require('apollo-server-express');

module.exports = User = gql`
  extend type Query {
    me(cursor: String): User
    getUsers: [User]!
    getUserByUsername(username: String!): User
    getUserById(id: ID!): User
  }

  extend type Mutation {
    newUser(username: String!, email: String!, password: String!): String!
    logIn(email: String!, password: String!): String!
    toggleFollowUser(followed: ID!): User!
    forgotPassword(id: ID!): Boolean
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    accountLevel: Int!
    recipesCreated: [Recipe]!
    recipesSaved: [Recipe]!
    ingredientsCreated: [Ingredient]!
    liked: [Recipe]!
    followers: [User]!
    following: [User]!
  }
`;
