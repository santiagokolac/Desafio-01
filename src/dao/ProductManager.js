const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor(filePath) {
    this.path = path.join(__dirname, "..", "data", "products.json");
    this._initializeProducts();
  }

  async _initializeProducts() {
    try {
      const products = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(products);
    } catch (error) {
      console.error("Error inicializando productos:", error);
      this.products = [];
    }
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer el archivo:", error);
      return [];
    }
  }

  async _writeFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error al escribir en el archivo:", error);
      throw new Error("Error al guardar los datos");
    }
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos los campos son obligatorios");
    }

    const products = await this._readFile();

    if (products.some((product) => product.code === code)) {
      throw new Error("El código del producto debe ser único");
    }

    const id = products.length ? products[products.length - 1].id + 1 : 1;

    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    products.push(product);
    await this._writeFile(products);

    return product;
  }

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    const product = products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Not found");
    }
    return product;
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Not found");
    }
    products.splice(index, 1);
    await this._writeFile(products);
  }

  async updateProduct(id, update) {
    try {
      const products = await this._readFile();
      const index = products.findIndex((product) => product.id === id);
      if (index === -1) {
        throw new Error("Not found");
      }

      products[index] = { ...products[index], ...update, id };
      await this._writeFile(products);
    } catch (error) {
      throw new Error(`Error updating product with ID ${id}: ${error.message}`);
    }
  }
}

module.exports = ProductManager;
