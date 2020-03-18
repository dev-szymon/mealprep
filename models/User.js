const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    recipesCreated: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    recipesSaved: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
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
