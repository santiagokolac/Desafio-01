const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/ProductManager");
const { getSocket } = require("../socket");

const productManager = new ProductManager("../data/products.json");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    let products = await productManager.getProducts();

    if (limit) {
      products = products.slice(0, parseInt(limit));
    }

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error al obtener productos: ${error.message}` });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(parseInt(pid));

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({
      error: `Error al obtener producto con ID ${pid}: ${error.message}`,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const product = await productManager.addProduct(req.body);
    const io = getSocket();
    io.emit("productos", await productManager.getProducts());
    res.json({ message: "Producto agregado exitosamente", product });
  } catch (error) {
    res
      .status(400)
      .json({ error: `Error al agregar producto: ${error.message}` });
  }
});

router.put("/:pid", async (req, res) => {
  let pid;
  try {
    pid = req.params.pid;
    const updatedFields = req.body;

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ error: "No se proporcionaron campos para actualizar" });
    }

    await productManager.updateProduct(parseInt(pid), updatedFields);

    const io = getSocket();
    io.emit("productos", await productManager.getProducts());

    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    res.status(400).json({
      error: `Error al actualizar producto con ID ${pid}: ${error.message}`,
    });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await productManager.deleteProduct(parseInt(pid));
    const io = getSocket();
    io.emit("productos", await productManager.getProducts());
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(400).json({
      error: `Error al eliminar producto con ID ${pid}: ${error.message}`,
    });
  }
});

module.exports = router;
