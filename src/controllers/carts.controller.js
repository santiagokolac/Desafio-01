import Cart from "../dao/models/Cart.js";
import Product from "../dao/models/Product.js";

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: "success", message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await Cart.findById(cid);
    cart.products = products;
    await cart.save();
    res.json({ status: "success", message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.json({ status: "success", message: "Product quantity updated" });
    } else {
      res
        .status(404)
        .json({ status: "error", message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    cart.products = [];
    await cart.save();
    res.json({ status: "success", message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
