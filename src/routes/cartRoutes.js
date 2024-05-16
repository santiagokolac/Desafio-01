const express = require("express");
const router = express.Router();
const CartManager = require("../dao/CartManager");

const cartManager = new CartManager("../data/carts.json");

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.json(carts);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error al obtener carritos: ${error.message}` });
  }
});

router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: `Error al crear carrito: ${error.message}` });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(parseInt(cid));

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({
      error: `Error al obtener carrito con ID ${cid}: ${error.message}`,
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
    res.json({ message: "Producto agregado al carrito exitosamente" });
  } catch (error) {
    res.status(400).json({
      error: `Error al agregar producto al carrito con ID ${cid}: ${error.message}`,
    });
  }
});

module.exports = router;
