import  { gql } from 'apollo-server-express';

const Ingredient = gql`
  extend type Query {
    getIngredient(id: ID!): Ingredient
    getIngredientByName(name: String!): [Ingredient]
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
  }

  input updateIngredientInput {
    name: String
    images: [String]
    kcal: Float
    carbs: Float
    protein: Float
    fats: Float
    glycemicIndex: Float
  }

  type Ingredient {
    id: ID!
    name: String!
    kcal: Float!
    carbs: Float!
    protein: Float!
    fats: Float!
    glycemicIndex: Float
    addedBy: User!
    isVerified: Boolean
    inRecipes: [Recipe]!
  }

  type IngredientFeed {
    recipes: [Recipe]!
    cursor: String!
    isMore: Boolean!
  }
`;

export default Ingredient