const { gql } = require('apollo-server-express');

module.exports = Ingredient = gql`
  extend type Query {
    getIngredient(id: ID!): Ingredient
    getIngredients: [Ingredient!]!
  }

  extend type Mutation {
    newIngredient(ingredient: createNewIngredient): Ingredient
  }

  input createNewIngredient {
    name: String!
    kcal: Int!
    carbs: Int!
    protein: Int!
    fats: Int!
  }

  type Ingredient {
    id: ID!
    name: String!
    kcal: Int!
    carbs: Int!
    protein: Int!
    fats: Int!
    inRecipes: [Recipe]!
  }
`;
