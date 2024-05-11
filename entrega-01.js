const { v4: uuidv4 } = require("uuid");
const ProductManager = require("./src/dao/ProductManager");
const CartManager = require("./src/dao/CartManager");

const productManager = new ProductManager(".src/data/products.json");
const cartManager = new CartManager("./src/data/carts.json");

const main = async () => {
  try {
    const product = {
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto",
      price: 100,
      thumbnails: "/images/nuevo-producto.png",
      code: "nuevo-producto-01",
      stock: 10,
      category: "Otros",
      thumbnailss: [
        "/images/nuevo-producto1.png",
        "/images/nuevo-producto2.png",
      ],
    };
    await productManager.addProduct(product);
    console.log("Producto agregado exitosamente");

    const products = await productManager.getProducts();
    console.log("Todos los productos:", products);

    const productId = 1;
    const fetchedProduct = await productManager.getProductById(productId);
    console.log(`Producto con id ${productId}:`, fetchedProduct);

    const updatedFields = { price: 150 };
    await productManager.updateProduct(productId, updatedFields);
    console.log("Producto actualizado exitosamente");

    await productManager.deleteProduct(productId);
    console.log("Producto eliminado exitosamente");

    const cart = await cartManager.createCart();
    console.log("Nuevo carrito creado:", cart);

    const cartId = cart.id;
    const productIdToAdd = 2;
    await cartManager.addProductToCart(cartId, productIdToAdd);
    console.log("Producto agregado al carrito exitosamente");

    const fetchedCart = await cartManager.getCartById(cartId);
    console.log(`Carrito con id ${cartId}:`, fetchedCart);
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
