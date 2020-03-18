const { gql } = require('apollo-server-express');
const User = require('./users');

module.exports = Recipe = gql`
  extend type Query {
    getRecipe(id: ID!): Recipe
    getRecipes: [Recipe]
  }

  extend type Mutation {
    newRecipe(recipe: createNewRecipe): Recipe
  }

  input createNewRecipe {
    name: String!
    createdBy: ID!
    ingredients: [ID!]!
    prepTime: Int!
  }

  type Recipe {
    id: ID!
    name: String!
    createdBy: User!
    ingredients: [Ingredient!]!
    prepTime: Int
    cookBooked: [User!]!
    likes: [User!]!
  }
`;
