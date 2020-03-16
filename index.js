const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

server.applyMiddleware({ app });
connectDB();

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
