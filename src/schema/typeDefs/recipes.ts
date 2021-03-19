import { gql } from 'apollo-server-express';

const Recipe = gql`
  extend type Query {
    getRecipe(id: ID!): Recipe
    getRecipes: [Recipe]
    getRecipesByName(name: String!): [Recipe]
    recipeFeed(cursor: String): RecipeFeed
  }

  extend type Mutation {
    newRecipe(recipe: recipeInput): Recipe!
    updateRecipe(recipe: ID!, changes: updateRecipeInput!): Recipe!
    deleteRecipe(id: ID!): Boolean
    toggleSaveRecipe(recipe: ID!): User!
    toggleLikeRecipe(recipe: ID!): User!
  }

  input recipeInput {
    name: String!
    images: [String]!
    private: Boolean!
    ingredients: [ID!]!
    description: [String]!
    prepTime: Float!
  }

  input updateRecipeInput {
    name: String
    images: [String]
    private: Boolean
    ingredients: [ID!]!
    description: [String]!
    prepTime: Float
  }

  type Recipe {
    id: ID!
    name: String!
    images: [String]!
    createdBy: User!
    private: Boolean!
    ingredients: [Ingredient!]!
    description: [String]!
    prepTime: Float!
    cookbooked: [User]!
    cookbookedNumber: Int!
    likes: [User]!
    likesNumber: Int!
    kcal: Int
  }

  type RecipeFeed {
    recipes: [Recipe]!
    cursor: String!
    isMore: Boolean!
  }
`;

export default Recipe;
