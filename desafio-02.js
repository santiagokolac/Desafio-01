const { v4: uuidv4 } = require("uuid");

const uuid = uuidv4();

console.log(uuid);

const ProductManager = require("./ProductManager");

const productManager = new ProductManager("./products.json");

const product = {
  title: "Celular",
  description: "Celular de alta gama",
  price: 400000,
  thumbnail: "/images/celular.png",
  code: "celular-01",
  stock: 50,
};

productManager
  .addProduct(product)
  .then(() => {
    console.log("Producto agregado exitosamente");
    return productManager.getProducts();
  })
  .then((products) => {
    console.log("Todos los productos:", products);
    return productManager.getProductById(1);
  })
  .then((product) => {
    console.log("Producto con id 1:", product);
    return productManager.updateProduct(1, { price: 900 });
  })
  .then(() => {
    console.log("Producto actualizado exitosamente");
    return productManager.deleteProduct(1);
  })
  .then(() => {
    console.log("Producto eliminado exitosamente");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
