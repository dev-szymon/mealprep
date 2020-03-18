const express = require('express');
const typeDefs = require('./schema/typeDefs/index');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;
const resolvers = require('./schema/resolvers/index');

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

server.applyMiddleware({ app });
connectDB();

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
