require("dotenv").config();
const express = require("express");
const { create } = require("express-handlebars");
const path = require("path");
const http = require("http");
const { initializeSocket } = require("./socket");

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

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

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

app.get("/realtimeproducts", (req, res) => {
  res.render("partials/realTimeProducts", { productos: [] });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;
