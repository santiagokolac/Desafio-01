const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor(filePath) {
    this.path = path.join(__dirname, "..", "data", "products.json");
  }

  async addProduct(product) {
    try {
      const products = await this._readFile();
      const newProduct = { id: this._getNextId(products), ...product };
      products.push(newProduct);
      await this._writeFile(products);
      return "Producto agregado exitosamente";
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  }

  async getProducts() {
    try {
      return await this._readFile();
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const products = await this._readFile();
      return products.find((product) => product.id === id) || null;
    } catch (error) {
      throw new Error(
        `Error al obtener producto con ID ${id}: ${error.message}`
      );
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const products = await this._readFile();
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        throw new Error("Producto no encontrado");
      }
      products[productIndex] = { ...products[productIndex], ...updatedFields };
      await this._writeFile(products);
      return "Producto actualizado exitosamente";
    } catch (error) {
      throw new Error(
        `Error al actualizar producto con ID ${id}: ${error.message}`
      );
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this._readFile();
      const newProducts = products.filter((product) => product.id !== id);
      await this._writeFile(newProducts);
      return "Producto eliminado exitosamente";
    } catch (error) {
      throw new Error(
        `Error al eliminar producto con ID ${id}: ${error.message}`
      );
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

  _getNextId(products) {
    const maxId = products.reduce(
      (max, product) => (product.id > max ? product.id : max),
      0
    );
    return maxId + 1;
  }
}

module.exports = ProductManager;
