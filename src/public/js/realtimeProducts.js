const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    socket.emit("requestInitialProducts"); 
});

socket.on("initialProducts", (products) => {
    products.forEach(product => addProductToDOM(product)); 
});

function addProductToDOM(product) {
  const productList = document.getElementById('realTimeProductList');
  const productCard = `
    <div class="productCard">
      <div class="cardProduct__image">
        <img src="${product.thumbnail}" alt="${product.title}" />
      </div>
      <div class="cardProduct__info">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>${product.price}</p>
        <p>${product.stock}</p>
        <p>${product.code}</p>
        <p>${product.id}</p>
      </div>
    </div>`;
  productList.innerHTML += productCard;
}

socket.on('updateProducts', (products) => {
  document.getElementById('realTimeProductList').innerHTML = '';
  products.forEach(addProductToDOM);
});
