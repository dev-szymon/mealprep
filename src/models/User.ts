import { model, Schema, Model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { UserDocument } from '../types';

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

UserSchema.pre('save', async function (this: UserDocument) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
});

UserSchema.methods.matchesPassword = function (password: string) {
  return compare(password, this.password);
};

export const User = model<UserDocument, Model<UserDocument>>(
  'User',
  UserSchema
);
