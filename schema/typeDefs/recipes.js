const { gql } = require('apollo-server-express');
const User = require('./users');

module.exports = Recipe = gql`
  extend type Query {
    getRecipe(id: ID!): Recipe
    getRecipes: [Recipe]
  }

  extend type Mutation {
    newRecipe(recipe: recipeInput): Recipe
    updateRecipe(recipe: recipeInput): Recipe
    deleteRecipe(recipe: ID!): Recipe
    toggleSaveRecipe(user: ID!, recipe: ID!): Recipe
    toggleLikeRecipe(user: ID!, recipe: ID!): Recipe
  }

  input recipeInput {
    name: String!
    createdBy: ID!
    public: Boolean!
    category: [String]!
    ingredients: [ID!]!
    description: String!
    prepTime: Float!
  }

  type Recipe {
    id: ID!
    name: String!
    createdBy: User!
    public: Boolean!
    category: [String]!
    ingredients: [Ingredient!]!
    description: String!
    prepTime: Float!
    cookBooked: [User!]!
    likes: [User!]!
  }
`;
