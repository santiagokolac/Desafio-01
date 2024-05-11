const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const socketIo = require("socket.io");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    extname: ".handlebars",
  })
);
app.set("view engine", "handlebars");

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: `Algo salió mal: ${err.message}` });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

app.get("/", (req, res) => {
  res.render("home", { productos: tusProductos });
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.emit("productos", tusProductos);

  socket.on("nuevoProducto", (producto) => {
    tusProductos.push(producto);
    io.emit("productos", tusProductos);
  });

  socket.on("eliminarProducto", (index) => {
    tusProductos.splice(index, 1);
    io.emit("productos", tusProductos);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
