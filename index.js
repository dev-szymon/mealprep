if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;
const typeDefs = require('./schema/typeDefs/index');
const resolvers = require('./schema/resolvers/index');
const helmet = require('helmet');
const cors = require('cors');

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    req, res;
  },
});

const app = express();
app.use(helmet());
app.use(cors());

apollo.applyMiddleware({ app });
connectDB();

app.listen(PORT, () => console.log(`server ready at ${PORT}`));
