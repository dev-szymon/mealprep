import { gql } from 'apollo-server-express';

const User = gql`
  extend type Query {
    me(cursor: String): User
    getUsers: [User]!
    getUserByUsername(username: String!): User
    getUserById(id: ID!): User
  }

  extend type Mutation {
    newUser(username: String!, email: String!, password: String!): String!
    logIn(email: String!, password: String!): String!
    logOut: Boolean!
    toggleFollowUser(followed: ID!): User!
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

export default User;
