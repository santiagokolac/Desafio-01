import Product from "../models/Product.js";

class ProductManagerMongo {
  async createProduct(productData) {
    const newProduct = new Product(productData);
    return await newProduct.save();
  }

  async getProductById(productId) {
    return await Product.findById(productId);
  }

  async updateProduct(productId, productData) {
    return await Product.findByIdAndUpdate(productId, productData, {
      new: true,
    });
  }

  async deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId);
  }

  async getAllProducts() {
    return await Product.find();
  }
}

export default new ProductManagerMongo();
