const { gql } = require('apollo-server-express');

module.exports = User = gql`
  extend type Query {
    me(userId: ID!): User
    getUsers: [User]!
    getUser(id: ID!): User
  }

  extend type Mutation {
    newUser(username: String!, email: String!, password: String!): User
    logIn(email: String!, password: String!): User
    toggleFollowUser(user: ID!, followed: ID!): User
  }

  type User {
    id: ID!
    username: String!
    email: String!
    recipesCreated: [Recipe]!
    recipesSaved: [Recipe]!
    liked: [Recipe]!
    followers: [User]!
    following: [User]!
  }
`;
