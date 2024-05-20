document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  function addProduct(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;

    socket.emit("addProduct", {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });

    document.getElementById("productForm").reset();
  }

  function deleteProduct(event) {
    event.preventDefault();

    const productId = document.getElementById("deleteId").value;

    socket.emit("deleteProduct", { id: parseInt(productId) });

    document.getElementById("deleteId").value = "";
  }

  const productForm = document.getElementById("productForm");
  productForm.addEventListener("submit", addProduct);

  const deleteForm = document.getElementById("deleteForm");
  deleteForm.addEventListener("submit", deleteProduct);
});
