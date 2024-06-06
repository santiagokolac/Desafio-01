import CartManagerMongo from "../dao/mongoDb/CartManagerMongo.js";
import CartManagerFileSystem from "../dao/fileSystem/CartManager.js";

const useMongoDb = true;

const CartManager = useMongoDb ? CartManagerMongo : CartManagerFileSystem;

class CartService {
  async createCart(cartData) {
    return await CartManager.createCart(cartData);
  }

  async getCartById(cartId) {
    return await CartManager.getCartById(cartId);
  }

  async addProductToCart(cartId, productId, quantity) {
    return await CartManager.addProductToCart(cartId, productId, quantity);
  }

  async removeProductFromCart(cartId, productId) {
    return await CartManager.removeProductFromCart(cartId, productId);
  }
}

export default new CartService();
