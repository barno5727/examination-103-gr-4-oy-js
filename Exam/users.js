const users = document.querySelector(".users");
const updateModal = document.querySelector(".update__modal");

function fetchProducts(url, callback) {
  let unknownData;
  fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      renderData(data);
      unknownData = data;
    })
    .then(() => callback(unknownData));
}

fetchProducts("https://api.escuelajs.co/api/v1/users", renderData);

function renderData(arr) {
  console.log(arr);
  arr.forEach((user) => {
    const { id, avatar, name, role, email } = user;
    const userCard = `
    <div class="products-row">
        <div class="product-cell sales">
        <span class="cell-label">ID:</span>${id}
        </div>

        <div class="product-cell image">
        <img
            src=${avatar}
            alt="product"
        />
        </div>

        <div class="product-cell image">
        <span>${name}</span>
        </div>
        <div class="product-cell category">
        <span class="cell-label">Role:</span>${role}
        </div>
        <div class="product-cell category">
        <span class="cell-label">Email:</span>${email}
        </div>
        <div class="product-cell buttons">
        <button id=${id} class="update___btn" > Update </button>
        </div>
  </div>
    `;

    users.insertAdjacentHTML("beforeend", userCard);
  });
}

users.addEventListener("click", (e) => {
  if (e.target.matches(".update___btn")) {
    e.preventDefault();
    openUpdateProductModal(e.target.id);
  }
});

function openUpdateProductModal(id) {
  updateModal.classList.add("open__modal");
  const cancelBtn = document.querySelector(".update__modal .cancel-btn");
  const modalContent = document.querySelector(".update__modal__content");
  fetch(`https://api.escuelajs.co/api/v1/users/${id}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      fetchProducts("https://api.escuelajs.co/api/v1/users", renderData);
      getSingleUser(data);
    });

  function getSingleUser(userData) {
    const singleUserData = `
          <div>
              <img src=${userData.avatar} alt="">
      
              <p>Name: ${userData.name}</p>
              <p>email: ${userData.email}</p>
              <p>role:  ${userData.role}</p>
              <button class="cancel-btn">close</button>
          </div>
        `;

    modalContent.innerHTML = singleUserData;
  }

  cancelBtn.addEventListener("click", (e) => {
    if(e.target.matches(".cancel-btn")){
    updateModal.classList.remove("open__modal");
    }
});
}
