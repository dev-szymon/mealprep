if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;
const typeDefs = require('./schema/typeDefs/index');
const resolvers = require('./schema/resolvers/index');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    req, res;
  },
});

const app = express();

server.applyMiddleware({ app });
connectDB();

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
