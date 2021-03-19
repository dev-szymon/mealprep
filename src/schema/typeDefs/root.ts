import { gql } from 'apollo-server-express';

const Root = gql`
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

export default Root
