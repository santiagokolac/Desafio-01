require("dotenv").config();
const express = require("express");
const { create } = require("express-handlebars");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = io;
