const users = require('./users');
const recipes = require('./recipes');
const ingredients = require('./ingredients');

const resolvers = [users, recipes, ingredients];
module.exports = resolvers;
