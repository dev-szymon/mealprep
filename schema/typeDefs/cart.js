const { gql } = require('apollo-server-express');

module.exports = cart = gql`
  extend type Query {
    getCart(id: ID!): Cart
  }

  extend type Mutation {
    addProduct(cart: ID!, product: ID!): Cart
  }

  type Cart {
    id: ID!
    owner: User!
    products: [Ingredient]!
  }
`;
