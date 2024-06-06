import { Router } from "express";
import ProductManager from "../dao/fileSystem/ProductManager.js";

const productManager = new ProductManager();
const router = Router();

router.post("/", async (req, res) => {
  try {
    await productManager.addProduct(req.body);
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await productManager.getProductById(
      parseInt(req.params.id, 10)
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await productManager.updateProduct(parseInt(req.params.id, 10), req.body);
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await productManager.deleteProduct(parseInt(req.params.id, 10));
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
