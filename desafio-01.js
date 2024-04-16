class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Por favor rellene todos los campos");
      return;
    }

    if (this.products.some((product) => product.code === code)) {
      console.log("Ya existe un producto con ese código");
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
      console.log("Producto no encontrado");
    }
  }
}

const productManager = new ProductManager();

productManager.addProduct(
  "Celular",
  "Celular de alta gama",
  350000,
  "/images/phone01.png",
  "phone01",
  100
);
productManager.addProduct(
  "Notebook",
  "Notebook gamer",
  2000000,
  "/images/notebook01.png",
  "notebook01",
  50
);
productManager.addProduct(
  "Tablet",
  "Tablet de gama media",
  200000,
  "/images/tablet01.png",
  "tablet01",
  75
);

console.log(productManager.getProducts());
console.log(productManager.getProductById(2));
console.log(productManager.getProductById(4));
