const users = require('./users');
const ingredients = require('./ingredients');
const recipes = require('./recipes');

const resolvers = [users, recipes, ingredients];
module.exports = resolvers;
