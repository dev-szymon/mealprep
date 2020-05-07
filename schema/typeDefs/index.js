const user = require('./users');
const ingredient = require('./ingredients');
const recipe = require('./recipes');
const root = require('./root');
const week = require('./week');
const cart = require('./cart');

const typeDefs = [user, ingredient, recipe, root, week, cart];
module.exports = typeDefs;
