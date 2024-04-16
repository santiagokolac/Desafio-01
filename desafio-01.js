class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("All fields are mandatory.");
      return;
    }

    if (this.products.some((product) => product.code === code)) {
      console.log("Product with the same code already exists.");
      return;
    }

    const product = {
      id: this.getMaxId() + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);
  }

  getMaxId() {
    let maxId = 0;
    this.products.forEach((product) => {
      if (product.id > maxId) maxId = product.id;
    });
    return maxId;
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find((product) => product.id === productId);
    if (product) {
      return product;
    } else {
      console.log("Product not found.");
    }
  }
}

const productManager = new ProductManager();

productManager.addProduct(
  "Phone",
  "Smartphone",
  799.99,
  "/path/to/image1",
  "PHN001",
  100
);
productManager.addProduct(
  "Laptop",
  "High-performance laptop",
  1499.99,
  "/path/to/image2",
  "LTP001",
  50
);
productManager.addProduct(
  "Tablet",
  "Tablet device",
  399.99,
  "/path/to/image3",
  "TBL001",
  75
);

console.log(productManager.getProducts());
console.log(productManager.getProductById(2));
console.log(productManager.getProductById(4));
