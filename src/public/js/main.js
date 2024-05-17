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

    const formData = new FormData(productForm);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/products", true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("Producto agregado exitosamente");
      } else {
        console.error("Error al agregar producto");
      }
    };
    xhr.send(formData);
  });
});
