const users = require('./users');
const ingredients = require('./ingredients');
const recipes = require('./recipes');
const dayplan = require('./dayplan');

const resolvers = [users, recipes, ingredients, dayplan];
module.exports = resolvers;
