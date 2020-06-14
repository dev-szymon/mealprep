const { gql } = require('apollo-server-express');
const User = require('./users');

module.exports = Recipe = gql`
  extend type Query {
    getRecipe(id: ID!): Recipe
    getRecipes: [Recipe]
  }

  extend type Mutation {
    newRecipe(recipe: recipeInput): Recipe!
    updateRecipe(recipe: recipeInput): Recipe!
    deleteRecipe(recipe: ID!): Boolean
    toggleSaveRecipe(recipe: ID!): Recipe!
    toggleLikeRecipe(recipe: ID!): Recipe!
  }

  input recipeInput {
    name: String!
    pictures: [String]!
    createdBy: ID!
    public: Boolean!
    tags: [String]!
    ingredients: [ID!]!
    description: String!
    prepTime: Float!
  }

  type Recipe {
    id: ID!
    name: String!
    pictures: [String]!
    createdBy: User!
    public: Boolean!
    tags: [String]!
    ingredients: [Ingredient!]!
    description: String!
    prepTime: Float!
    cookBooked: [User]!
    likes: [User]!
  }
`;
