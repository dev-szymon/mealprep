const users = require('./users');
const ingredients = require('./ingredients');
const recipes = require('./recipes');
const week = require('./week');

const resolvers = [users, recipes, ingredients, week];
module.exports = resolvers;
