const products = document.querySelector(".products");
const deleteModal = document.querySelector(".modal__wrapper");
const cancelDeleteModal = document.querySelector(".cancel-btn");
const deleteProductBtn = document.querySelector(".delete-btn");
const addProductBtn = document.querySelector(".app-content-btn");
const addModal = document.querySelector(".add-modal__wrapper");
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

fetchProducts("https://api.escuelajs.co/api/v1/products", renderData);

function renderData(arr) {
  console.log(arr);
  arr.forEach((product) => {
    const {
      id,
      images,
      title,
      category: { name },
      price,
      description,
    } = product;
    const productCard = `
    <div class="products-card">
            <div class="products-card-img ">
                <img
                src=${images[0]}
                alt=""
                />
            </div>
            <p class="products-card-title">${title}</p>
            <div class="product-card-category">
                <span>Category:</span>
                <span>${name}</span>
            </div>
            <div class="product-card-category">
                <span>Price:</span>
                <span> $${price}</span>
            </div>
            <p class="product-card-description">
            ${description.split(" ").slice(0, 5).join(" ")}...
                </p>

            <button id=${id} class="update__btn" >Update</button>
            <button id=${id} class="delete__btn" >Delete</button>
        </div>
  `;

    products.insertAdjacentHTML("beforeend", productCard);
  });
}

products.addEventListener("click", (e) => {
  if (e.target.matches(".delete__btn")) {
    e.preventDefault();
    openDeleteProductModal(e.target.id);
  }
  if (e.target.matches(".update__btn")) {
    e.preventDefault();
    openUpdateProductModal(e.target.id);
  }
});

function openUpdateProductModal(id) {
  updateModal.classList.add("open__modal");
  const cancelBtn = document.querySelector(".update__modal .cancel-btn");
  const updateBtn = document.querySelector(".update__modal .update-btn");
  const productTitle = document.querySelector(".update__title");
  const productPrice = document.querySelector(".update__price");
  cancelBtn.addEventListener("click", () => {
    updateModal.classList.remove("open__modal");
  });

  updateBtn.addEventListener("click", () => {
    let price = Math.abs(productPrice.value);
    let title = productTitle.value;
    updateProduct(id, title, price);
  });
}

function updateProduct(id, title, price) {
  fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      title,
      price,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      fetchProducts("https://api.escuelajs.co/api/v1/products", renderData);
      window.location.reload();
    });
}

addProductBtn.addEventListener("click", () => {
  const cancelAddModal = document.querySelector(
    ".add-product-modal .cancel-btn"
  );
  const addProductBtn = document.querySelector(".add-product-modal .add-btn");
  addModal.classList.add("open__modal");
  cancelAddModal.addEventListener("click", () => {
    addModal.classList.remove("open__modal");
  });
  addProductBtn.addEventListener("click", () => openAddProductModal());
});

function openDeleteProductModal(id) {
  deleteModal.classList.add("open__modal");
  cancelDeleteModal.addEventListener("click", () => {
    deleteModal.classList.remove("open__modal");
  });

  deleteProductBtn.addEventListener("click", () => {
    deleteProduct(+id);
    deleteModal.classList.remove("open__modal");
  });
}

function openAddProductModal() {
  const title = document.querySelector(".product__title").value;
  const price = document.querySelector(".product__price").value;
  const description = document.querySelector(".product__desc").value;
  const images = document.querySelector(".product__img").value;

  fetch("https://api.escuelajs.co/api/v1/products/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      title,
      price,
      images: [images],
      description,
      categoryId: 1,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      fetchProducts("https://api.escuelajs.co/api/v1/products", renderData);
      window.location.reload();
    })
    .catch((err) => console.log(err));
}

function deleteProduct(id) {
  fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      fetchProducts("https://api.escuelajs.co/api/v1/products", renderData);
      window.location.reload();
    });
}
