const user = require('./users');
const ingredient = require('./ingredients');
const recipe = require('./recipes');
const root = require('./root');
const dayplan = require('./dayplan');

const typeDefs = [user, ingredient, recipe, root, dayplan];
module.exports = typeDefs;
