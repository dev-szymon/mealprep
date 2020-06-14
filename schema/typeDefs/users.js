const { gql } = require('apollo-server-express');

module.exports = User = gql`
  extend type Query {
    me: User
    getUsers: [User]!
    getUserByUsername(username: String!): User
    getUserById(id: ID!): User
  }

  extend type Mutation {
    newUser(username: String!, email: String!, password: String!): String!
    logIn(email: String!, password: String!): String!
    toggleFollowUser(followed: ID!): User!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    recipesCreated: [Recipe]!
    recipesSaved: [Recipe]!
    liked: [Recipe]!
    followers: [User]!
    following: [User]!
  }
`;
