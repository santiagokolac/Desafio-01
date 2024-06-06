const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor de WebSocket");
});

socket.on("products", (products) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = product.title;
    productList.appendChild(li);
  });
});

document
  .getElementById("add-product-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const product = {};
    formData.forEach((value, key) => {
      product[key] = value;
    });
    socket.emit("addProduct", product);
  });

document
  .getElementById("delete-product-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productId = formData.get("id");
    socket.emit("deleteProduct", { id: productId });
  });
