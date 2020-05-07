const { gql } = require('apollo-server-express');
const User = require('./users');

module.exports = Recipe = gql`
  extend type Query {
    getRecipe(id: ID!): Recipe
    getRecipes: [Recipe]
  }

  extend type Mutation {
    newRecipe(recipe: createNewRecipe): Recipe
    deleteRecipe(recipeID: ID!): Recipe
    saveRecipe(loggedIn: ID!, recipeId: ID!): Recipe
    unsaveRecipe(loggedIn: ID!, recipeId: ID!): Recipe
    likeRecipe(loggedIn: ID!, recipeId: ID!): Recipe
    unlikeRecipe(loggedIn: ID!, recipeId: ID!): Recipe
  }

  input createNewRecipe {
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
