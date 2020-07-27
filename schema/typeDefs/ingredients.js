const { gql } = require('apollo-server-express');

module.exports = Ingredient = gql`
  extend type Query {
    getIngredient(id: ID!): Ingredient
    getIngredients: [Ingredient]
    ingredientFeed(cursor: String): IngredientFeed
  }

  extend type Mutation {
    newIngredient(ingredient: ingredientInput): Ingredient
    updateIngredient(
      ingredient: ID!
      changes: updateIngredientInput
    ): Ingredient
    verifyIngredient(ingredient: ID!): Ingredient
  }

  input ingredientInput {
    name: String!
    images: [String]!
    kcal: Float!
    carbs: Float!
    protein: Float!
    fats: Float!
    glycemicIndex: Float
    tips: [String]!
  }

  input updateIngredientInput {
    name: String
    images: [String]
    kcal: Float
    carbs: Float
    protein: Float
    fats: Float
    glycemicIndex: Float
    tips: [String]
  }

  type Ingredient {
    id: ID!
    name: String!
    kcal: Float!
    carbs: Float!
    protein: Float!
    fats: Float!
    glycemixIndex: Float
    addedBy: User!
    isVerified: Boolean
    tips: [String]!
    inRecipes: [Recipe]!
  }

  type IngredientFeed {
    recipes: [Recipe]!
    cursor: String!
    isMore: Boolean!
  }
`;
