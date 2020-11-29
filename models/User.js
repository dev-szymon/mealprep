const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const UserSchema = new Schema(
  {
    username: { type: String },
    email: { type: String },
    password: { type: String },
    avatar: { type: String },
    accountLevel: { type: Number, default: 1 },
    recipesCreated: [{ type: ObjectId, ref: 'Recipe', default: [] }],
    recipesSaved: [{ type: ObjectId, ref: 'Recipe', default: [] }],
    ingredientsCreated: [{ type: ObjectId, ref: 'Ingredient', default: [] }],
    liked: [{ type: ObjectId, ref: 'Recipe', default: [] }],
    followers: [{ type: ObjectId, ref: 'User', default: [] }],
    following: [{ type: ObjectId, ref: 'User', default: [] }],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
});

UserSchema.methods.matchesPassword = function (password) {
  return compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
