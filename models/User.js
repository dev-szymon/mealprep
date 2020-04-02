const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    mealPlan: { type: ObjectId, ref: 'Week' },
    recipesCreated: [{ type: ObjectId, ref: 'Recipe' }],
    recipesSaved: [{ type: ObjectId, ref: 'Recipe' }],
    followers: [{ type: ObjectId, ref: 'User' }],
    following: [{ type: ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

UserSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
});

UserSchema.methods.matchesPassword = function(password) {
  return compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
