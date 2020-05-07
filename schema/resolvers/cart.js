const Cart = require('../../models/Cart');

module.exports = {
  Query: {
    getCart: (root, args, context, info) => {
      return Cart.findById(args.id);
    },
  },
  Mutation: {
    addProduct: async (root, args, context, info) => {
      const { cart, product } = args;
      await Cart.updateOne(
        { _id: { $in: cart } },
        {
          $push: { products: product },
        }
      );
      return cart;
    },
  },
  Cart: {
    owner: async (cart, args, context, info) => {
      await cart.populate({ path: 'owner' }).execPopulate();
      return cart.owner;
    },
    products: async (cart, args, context, info) => {
      await cart
        .populate({ path: 'products', populate: { path: 'products' } })
        .execPopulate();
      return cart.products;
    },
  },
};
