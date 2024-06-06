import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import { create } from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import ProductManager from "./dao/fileSystem/ProductManager.js";
import { initializeSocket, getSocket } from "./socket.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import fs from "fs";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);
const productManager = new ProductManager("./products.json");

const hbs = create({
  extname: ".handlebars",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
});

app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");
app.set("views", path.join(__dirname, "views"));

const dbURI = process.env.MONGODB_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/views", viewRoutes);

app.get("/", (req, res) => {
  res.send("¡Hola! Esta es la página de inicio.");
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("partials/realTimeProducts", { products });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const filePath = path.join(__dirname, "data", "products.json");

app.get("/api/products", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error leyendo el archivo JSON:", err);
      return res.status(500).json({ error: "Error leyendo los productos" });
    }

    try {
      const products = JSON.parse(data);
      res.json(products);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.status(500).json({ error: "Error procesando los productos" });
    }
  });
});

app.get("/products", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    let filter = {};
    if (query) {
      filter = { $or: [{ category: query }, { availability: query }] };
    }

    let sortOption = {};
    if (sort) {
      sortOption.price = sort === "asc" ? 1 : -1;
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(limit)
      .skip((page - 1) * limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:
        page > 1
          ? `/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
      nextLink:
        page < totalPages
          ? `/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/api/products/:pid", async (req, res) => {
  const product = productManager.getProductById(parseInt(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).send("Product not found");
  }
});

app.post("/api/products", async (req, res) => {
  productManager.addProduct(req.body);
  res.status(201).send("Product added");
});

app.put("/api/products/:pid", async (req, res) => {
  productManager.updateProduct(parseInt(req.params.pid), req.body);
  res.send("Product updated");
});

app.delete("/api/products/:pid", async (req, res) => {
  productManager.deleteProduct(parseInt(req.params.pid));
  res.send("Product deleted");
});

app.get("/views/products", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    let filter = {};
    if (query) {
      filter = { $or: [{ category: query }, { availability: query }] };
    }

    let sortOption = {};
    if (sort) {
      sortOption.price = sort === "asc" ? 1 : -1;
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(limit)
      .skip((page - 1) * limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.render("products", {
      products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:
        page > 1
          ? `/views/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
      nextLink:
        page < totalPages
          ? `/views/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/views/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    res.render("cart", { cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/api/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.delete("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    cart.products = cart.products.filter(
      (product) => product._id.toString() !== pid
    );
    await cart.save();
    res.json({ status: "success", message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.put("/api/carts/:cid", async (req, res) => {
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
});

app.put("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    const product = cart.products.find(
      (product) => product._id.toString() === pid
    );
    if (product) {
      product.quantity = quantity;
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
});

app.delete("/api/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    cart.products = [];
    await cart.save();
    res.json({ status: "success", message: "All products removed from cart" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

io.on("connection", async (socket) => {
  console.log("New client connected");

  socket.emit("products", await productManager.getProducts());

  socket.on("addProduct", async (data) => {
    try {
      await productManager.addProduct(data);
      io.emit("products", await productManager.getProducts());
    } catch (error) {
      console.error("Error adding product:", error);
    }
  });

  socket.on("deleteProduct", async (data) => {
    try {
      await productManager.deleteProduct(data.id);
      io.emit("products", await productManager.getProducts());
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
