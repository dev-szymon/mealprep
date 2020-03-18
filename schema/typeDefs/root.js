const { gql } = require('apollo-server-express');

module.exports = Root = gql`
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
  type Subscription {
    _: String
  }
`;
