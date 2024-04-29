const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    try {
      const products = await this.getProductsFromFile();
      const requiredFields = [
        "title",
        "description",
        "price",
        "thumbnail",
        "code",
        "stock",
      ];
      const missingFields = requiredFields.filter(
        (field) => !(field in product)
      );
      if (missingFields.length > 0) {
        throw new Error(
          `Campos obligatorios faltantes: ${missingFields.join(", ")}`
        );
      }
      if (products.some((p) => p.code === product.code)) {
        throw new Error("El código de producto ya existe");
      }
      product.id = this.generateUniqueId(products);
      products.push(product);
      await this.saveProductsToFile(products);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }

  async getProducts() {
    try {
      const products = await this.getProductsFromFile();
      return products;
    } catch (error) {
      console.error("Error al obtener producto:", error);
      return [];
    }
  }

  async getProductById(productId) {
    try {
      const products = await this.getProductsFromFile();
      const product = products.find((p) => p.id === productId);
      if (product) {
        return product;
      } else {
        console.log("Producto no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener producto por id", error);
      return null;
    }
  }

  async updateProduct(productId, updatedFields) {
    try {
      let products = await this.getProductsFromFile();
      const index = products.findIndex((p) => p.id === productId);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedFields };
        await this.saveProductsToFile(products);
        console.log("Producto actualizado exitosamente");
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  }

  async deleteProduct(productId) {
    try {
      let products = await this.getProductsFromFile();
      products = products.filter((p) => p.id !== productId);
      await this.saveProductsToFile(products);
      console.log("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error al borrar producto", error);
    }
  }

  async getProductsFromFile() {
    try {
      if (fs.existsSync(this.path)) {
        const productsData = await fs.promises.readFile(this.path, "utf8");
        return JSON.parse(productsData);
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error al leer el archivo de productos", error);
      return [];
    }
  }

  async saveProductsToFile(products) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      console.log("Productos guardados en el archivo exitosamente");
    } catch (error) {
      console.error("Error al guardar productos en el archivo:", error);
    }
  }

  generateUniqueId(products) {
    if (products.length === 0) return 1;
    const maxId = Math.max(...products.map((p) => p.id));
    return maxId + 1;
  }
}

module.exports = ProductManager;
