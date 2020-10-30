require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectRedis = require('connect-redis');
const Redis = require('ioredis');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;
const typeDefs = require('./schema/typeDefs/index');
const resolvers = require('./schema/resolvers/index');

const RedisStore = connectRedis(session);

const client = new Redis({
  port: 6379,
  host: 'localhost',
});

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const user = req.session.sid;

    // send req res and user to resolvers with context
    return { req, res, user };
  },
  // introspection is needed for gatsby-source-graphql plugin to build schema on front end
  introspection: true,
});

const app = express();

app.use(
  session({
    store: new RedisStore({ client }),
    name: 'sid',
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: true,
    },
    secret: process.env.REDIS_SECRET,
    rolling: true,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

apollo.applyMiddleware({ app, cors: false });
connectDB();

app.listen(PORT, () => console.log(`server ready at ${PORT}`));
