const user = require('./users');
const ingredient = require('./ingredients');
const recipe = require('./recipes');
const root = require('./root');
const week = require('./week');

const typeDefs = [user, ingredient, recipe, root, week];
module.exports = typeDefs;
