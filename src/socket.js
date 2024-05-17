const socketIo = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });

  return io;
};

const getSocket = () => {
  if (!io) {
    throw new Error("Socket.io no está inicializado");
  }
  return io;
};

module.exports = { initializeSocket, getSocket };
