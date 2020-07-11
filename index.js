require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;
const typeDefs = require('./schema/typeDefs/index');
const resolvers = require('./schema/resolvers/index');
const cookieParser = require('cookie-parser');
const {
  getUser,
  sendRefreshToken,
  createRefreshToken,
  createAccessToken,
} = require('./auth');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const token = req.headers.authorization;
    // try to retrieve a user with the token
    const user = getUser(token);
    // send req res and user to resolvers with context
    return { req, res, user };
  },
  // introspection is needed for gatsby-source-graphql plugin to build schema on front end
  introspection: true,
});

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(cookieParser());
app.post('/refresh_token', async (req, res) => {
  const token = req.cookies.qeso;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }

  // token is valid, check the user
  const user = await User.findOne({ _id: payload.id });

  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  // check the token version
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.send({ ok: true, accessToken: createAccessToken(user) });
});

apollo.applyMiddleware({ app, cors: false });
connectDB();

app.listen(PORT, () => console.log(`server ready at ${PORT}`));
