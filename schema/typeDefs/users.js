const { gql } = require('apollo-server-express');

module.exports = User = gql`
  extend type Query {
    me: User
    getUsers: [User]!
    getUser(id: ID!): User
  }

  extend type Mutation {
    newUser(name: String!, email: String!, password: String!): User
    logIn(email: String!, password: String!): User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    recipesCreated: [Recipe]!
    recipesSaved: [Recipe]!
    followers: [User]!
    following: [User]!
  }
`;
