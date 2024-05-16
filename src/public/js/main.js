document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  socket.on("productos", (productos) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    productos.forEach((product) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${product.title} - ${product.price}`;
      productList.appendChild(listItem);
    });
  });

  const productForm = document.getElementById("product-form");
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    socket.emit("nuevoProducto", { title, price });
  });
});
