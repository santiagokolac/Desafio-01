import { Router } from "express";
import CartManager from "../dao/fileSystem/CartManager.js";
import {
  removeProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart,
} from "../controllers/carts.controller.js";

const cartManager = new CartManager();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los carritos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.cid, req.body, {
      new: true,
    });
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.cid);
    res.json({ message: "Carrito eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el carrito" });
  }
});

router.delete("/:cid/products/:pid", removeProductFromCart);
router.put("/:cid", updateCart);
router.put("/:cid/products/:pid", updateProductQuantity);
router.delete("/:cid", clearCart);

export default router;
