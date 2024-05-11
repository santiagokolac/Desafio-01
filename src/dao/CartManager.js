const fs = require("fs");

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async createCart() {
    try {
      const carts = await this.getCartsFromFile();
      const cart = { id: this.generateUniqueId(carts), products: [] };
      carts.push(cart);
      await this.saveCartsToFile(carts);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const carts = await this.getCartsFromFile();
      const cart = carts.find((c) => c.id === cartId);
      if (cart) {
        return cart;
      } else {
        throw new Error("Carrito no encontrado");
      }
    } catch (error) {
      throw new Error(`Error al obtener carrito por id: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      let carts = await this.getCartsFromFile();
      const index = carts.findIndex((c) => c.id === cartId);
      if (index !== -1) {
        const cart = carts[index];
        const product = await productManager.getProductById(productId);
        if (product) {
          const productIndex = cart.products.findIndex(
            (p) => p.id === productId
          );
          if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
          } else {
            cart.products.push({ id: productId, quantity: 1 });
          }
          await this.saveCartsToFile(carts);
          console.log("Producto agregado al carrito exitosamente");
        } else {
          throw new Error("Producto inexistente");
        }
      } else {
        console.log("Carrito no encontrado");
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }

  async getCartsFromFile() {
    try {
      if (fs.existsSync(this.path)) {
        const cartsData = await fs.promises.readFile(this.path, "utf8");
        return JSON.parse(cartsData);
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`Error al leer el archivo de carritos: ${error.message}`);
    }
  }

  async saveCartsToFile(carts) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      console.log("Carritos guardados en el archivo exitosamente");
    } catch (error) {
      throw new Error(
        `Error al guardar carritos en el archivo: ${error.message}`
      );
    }
  }

  generateUniqueId(carts) {
    if (carts.length === 0) return 1;
    const maxId = Math.max(...carts.map((c) => c.id));
    return maxId + 1;
  }
}

module.exports = CartManager;
