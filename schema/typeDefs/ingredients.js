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
    kcal: Float!
    carbs: Float!
    protein: Float!
    fats: Float!
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

// need to create separate model for tips with author and likes
