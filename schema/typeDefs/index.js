const user = require('./users');
const ingredient = require('./ingredients');
const recipe = require('./recipes');
const root = require('./root');

const typeDefs = [user, ingredient, recipe, root];
module.exports = typeDefs;
