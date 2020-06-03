if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;
const typeDefs = require('./schema/typeDefs/index');
const resolvers = require('./schema/resolvers/index');
const fs = require('fs');
const https = require('https');
const http = require('http');

const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 443, hostname: 'eatwell.club' },
  development: { ssl: false, port: 4000, hostname: 'localhost' },
};

const environment = process.env.NODE_ENV;
const config = configurations[environment];

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    req, res;
  },
});

const app = express();

apollo.applyMiddleware({ app });
connectDB();

var server;
if (config.ssl) {
  // Assumes certificates are in a .ssl folder off of the package root. Make sure
  // these files are secured.
  server = https.createServer(
    {
      key: fs.readFileSync(`./ssl/${environment}/server.key`),
      cert: fs.readFileSync(`./ssl/${environment}/server.crt`),
    },
    app
  );
} else {
  server = http.createServer(app);
}

app.get('/', (req, res) => {
  res.send('<h1>Mealprep API</h1>');
});

server.listen(PORT, () =>
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${
      apollo.graphqlPath
    }`
  )
);
