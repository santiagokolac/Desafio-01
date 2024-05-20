const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor(filePath) {
    this.path = path.join(__dirname, "..", "data", "products.json");
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
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
    const products = await this._readFile();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Not found");
    }
    products[index] = { ...products[index], ...update, id };
    await this._writeFile(products);
  }
}

module.exports = ProductManager;
