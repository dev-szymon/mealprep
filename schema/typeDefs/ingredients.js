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
    fats: Int!
    carbs: Int!
    fibres: Int!
    kcal: Int!
  }

  type Ingredient {
    id: ID!
    name: String!
    fats: Int!
    carbs: Int!
    fibres: Int!
    kcal: Int!
    inRecipes: [Recipe]!
  }
`;
