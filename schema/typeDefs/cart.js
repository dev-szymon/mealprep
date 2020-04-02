const { gql } = require('apollo-server-express');

module.exports = cart = gql`
  extend type Query {
    getCart(id: ID!): Cart
  }

  extend type Mutation {
  }

  type Cart {
    id: ID!
    user: User!
    ingredients: String!
    meals: [Meal]!
  }

  type Meal {
    id: ID!
    dayID: ID!
    recipe: Recipe!
    label: String!
  }
`;
