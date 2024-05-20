require("dotenv").config();
const express = require("express");
const { create } = require("express-handlebars");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const ProductManager = require("./dao/ProductManager");
const { initializeSocket } = require("./socket");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const fs = require("fs");

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

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

module.exports = app;
