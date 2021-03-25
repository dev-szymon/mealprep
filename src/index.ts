import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
const helmet = require('helmet');
import cors from 'cors';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import connectDB from './config/db';
import typeDefs from './schema/typeDefs/index';
import resolvers from './schema/resolvers/index';
const PORT = process.env.PORT || 5000;

declare module 'express-session' {
  interface Session {
    sid?: string;
  }
}

const app = express();

const RedisStore = connectRedis(session);

const client = new Redis({
  port: 6379,
  host: process.env.HOST_URL,
});

app.use(
  session({
    secret: process.env.REDIS_SECRET!,
    store: new RedisStore({ client }),
    name: 'sid',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      domain:
        process.env.NODE_ENV === 'production'
          ? process.env.CLIENT_DOMAIN
          : 'localhost',
    },

    rolling: true,
    resave: false,
    saveUninitialized: false,
  })
);

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const user = req.session.sid;

    return { req, res, user };
  },
  introspection: true,
  playground: true,
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.static('public'));

apollo.applyMiddleware({ app, cors: false });
connectDB();

app.listen(PORT, () => console.log(`server ready at ${PORT}`));
