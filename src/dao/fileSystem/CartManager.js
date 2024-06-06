import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {
  constructor(filePath) {
    this.path = path.join(__dirname, "..", "..", "data", "carts.json");
  }

  async createCart() {
    try {
      const carts = await this._readFile();
      const newCart = { id: this._getNextId(carts), products: [] };
      carts.push(newCart);
      await this._writeFile(carts);
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  async getCartById(id) {
    try {
      const carts = await this._readFile();
      return carts.find((cart) => cart.id === id) || null;
    } catch (error) {
      throw new Error(
        `Error al obtener carrito con ID ${id}: ${error.message}`
      );
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const carts = await this._readFile();
      const cart = carts.find((cart) => cart.id === cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products.push(productId);
      await this._writeFile(carts);
    } catch (error) {
      throw new Error(
        `Error al agregar producto al carrito con ID ${cartId}: ${error.message}`
      );
    }
  }

  async getAllCarts() {
    try {
      const carts = await this._readFile();
      return carts;
    } catch (error) {
      throw new Error(`Error al obtener carritos: ${error.message}`);
    }
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Error al leer el archivo: ${error.message}`);
    }
  }

  async _writeFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Error al escribir en el archivo: ${error.message}`);
    }
  }

  _getNextId(carts) {
    const maxId = carts.reduce(
      (max, cart) => (cart.id > max ? cart.id : max),
      0
    );
    return maxId + 1;
  }
}

export default CartManager;
