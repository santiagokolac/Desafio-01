import ProductManagerMongo from "../dao/mongoDb/ProductManager.js";
import ProductManagerFileSystem from "../dao/fileSystem/ProductManager.js";

const useMongoDb = true;

const ProductManager = useMongoDb
  ? ProductManagerMongo
  : ProductManagerFileSystem;

class ProductService {
  async createProduct(productData) {
    return await ProductManager.createProduct(productData);
  }

  async getProductById(productId) {
    return await ProductManager.getProductById(productId);
  }

  async updateProduct(productId, productData) {
    return await ProductManager.updateProduct(productId, productData);
  }

  async deleteProduct(productId) {
    return await ProductManager.deleteProduct(productId);
  }

  async getAllProducts() {
    return await ProductManager.getAllProducts();
  }
}

export default new ProductService();
