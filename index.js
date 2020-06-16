if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;
const typeDefs = require('./schema/typeDefs/index');
const resolvers = require('./schema/resolvers/index');

const getUser = (token) => {
  if (token) {
    try {
      // return the user information from the token
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // if there's a problem with the token, throw an error
      throw new Error('Session invalid');
    }
  }
};

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  cors: cors(),
  context: ({ req, res }) => {
    const token = req.headers.authorization;
    // try to retrieve a user with the token
    const user = getUser(token);
    return { req, res, user };
  },
  introspection: true,
  playground: true,
});

const app = express();
app.use(helmet());

apollo.applyMiddleware({ app });
connectDB();

app.listen(PORT, () => console.log(`server ready at ${PORT}`));
