import Cart from "../models/Cart.js";

class CartManagerMongo {
  async createCart() {
    const cart = new Cart();
    return await cart.save();
  }

  async getCartById(cartId) {
    return await Cart.findById(cartId).populate("products.productId");
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    const productIndex = cart.products.findIndex((p) =>
      p.productId.equals(productId)
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter((p) => !p.productId.equals(productId));
    return await cart.save();
  }
}

export default new CartManagerMongo();
