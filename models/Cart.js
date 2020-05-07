const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const CartSchema = new Schema(
  {
    owner: { type: ObjectId, ref: 'User' },
    products: [{ type: ObjectId, ref: 'Ingredient' }],
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
