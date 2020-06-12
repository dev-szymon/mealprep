const { gql } = require('apollo-server-express');

module.exports = Ingredient = gql`
  extend type Query {
    getIngredient(id: ID!): Ingredient
    getIngredients: [Ingredient!]!
  }

  extend type Mutation {
    newIngredient(ingredient: ingredientInput): Ingredient
    updateIngredient(ingredient: ingredientInput): Ingredient
  }

  input ingredientInput {
    name: String!
    kcal: Float!
    carbs: Float!
    protein: Float!
    fats: Float!
    tips: [String]
  }

  type Ingredient {
    id: ID!
    name: String!
    kcal: Float!
    carbs: Float!
    protein: Float!
    fats: Float!
    inRecipes: [Recipe]!
  }
`;
