"use strict";

// Product Data
const products = [
  {
    id: 1,
    image: "assets/s23.png",
    name: "Samsung Galaxy S23",
    price: 39999.0,
    category: "Phone",
  },
  {
    id: 2,
    image: "assets/s24.png",
    name: "Samsung Galaxy S24",
    price: 45999.0,
    category: "Phone",
  },
  {
    id: 3,
    image: "assets/s24u.png",
    name: "Samsung Galaxy S24 Ultra",
    price: 64999.0,
    category: "Phone",
  },
  {
    id: 4,
    image: "assets/s25u.png",
    name: "Samsung Galaxy S25 Ultra",
    price: 85999.0,
    category: "Phone",
  },
  {
    id: 5,
    image: "assets/zflip7.png",
    name: "Samsung Z-flip 7",
    price: 70999.0,
    category: "Phone",
  },
  {
    id: 6,
    image: "assets/zfold7.png",
    name: "Samsung Z-fold 7",
    price: 120999.0,
    category: "Phone",
  },
  {
    id: 7,
    image: "assets/tab-s10-fe-plus.png",
    name: "Samsung Galaxy Tab S10 Plus",
    price: 69999.0,
    category: "Tablet",
  },
  {
    id: 8,
    image: "assets/tab-s11u.png",
    name: "Samsung Galaxy Tab S11 Ultra",
    price: 90999.0,
    category: "Tablet",
  },
];

// Cart state: {id, img, name, price, cat, qty}
let cart = [];

// used for order numbering
let orderCounter = 0;

// DOM Elements
const productList = document.getElementById("productList");
const productCountBadge = document.getElementById("productCountBadge");
const cartTableBody = document.getElementById("cartTableBody");
const emptyCartHint = document.getElementById("emptyCartHint");
const cartWarning = document.getElementById("cartWarning");
const summaryEl = document.getElementById("summary");
const checkoutForm = document.getElementById("checkoutForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const paymentMethod = document.getElementById("paymentMethod");
const deliveryOption = document.getElementById("deliveryOption");
const addressGroup = document.getElementById("addressGroup");
const addressInput = document.getElementById("address");
const receiptArea = document.getElementById("receiptArea");
const receiptModal = document.getElementById("receiptModal");
const printReceiptBtn = document.getElementById("printReceiptBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const searchInput = document.getElementById("search-query");

// helpers

function formatMoney(n) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(n);
}

function nowString() {
  return new Date().toLocaleString("en-PH", { hour12: true });
}

function generateOrderId() {
  orderCounter += 1;
  const year = new Date().getFullYear();
  return `ORD-${year}-${String(orderCounter).padStart(6, "0")}`; // it is formatted as ORD-YYYY-000000 (ord id)
}

// render prod with filtering

function renderProducts(filter = "") {
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.category.toLowerCase().includes(filter.toLowerCase()),
  );

  productCountBadge.textContent = `${filtered.length} items`;

  if (filtered.length === 0) {
    productList.innerHTML = `
      <div class="col-12 text-center text-muted py-4">
        No products found for "<strong>${filter}</strong>"
      </div>
    `;
    return;
  }

  productList.innerHTML = filtered
    .map(
      (p) => `
    <div class="col-12 col-md-6 col-xl-4">
      <div class="card shadow-sm product-card h-100">
        <div class="card-body">
          <div class="small text-muted">${p.category}</div>
          <img src="${p.image}">
          <h6 class="mt-1 mb-2">${p.name}</h6>
          <div class="fw-bold money mb-3">${formatMoney(p.price)}</div>
          <button class="btn btn-dark btn-sm" onclick="addToCart(${p.id})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// card--

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

// UPDATE QUANTITY
function updateQty(productId, newQty) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  if (newQty <= 0) {
    removeItem(productId);
    return;
  }

  item.qty = newQty;
  renderCart();
}

function removeItem(productId) {
  cart = cart.filter((i) => i.id !== productId);
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;

  if (confirm("Are you sure you want to clear all items from the cart?")) {
    cart = [];
    renderCart();
  }
}

//  computations

function computeTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const discount = subtotal >= 1000 ? subtotal * 0.1 : 0;

  const taxableBase = Math.max(subtotal - discount, 0);
  const tax = taxableBase * 0.12;

  const shipping = subtotal >= 500 ? 0 : subtotal > 0 ? 80 : 0;

  const grandTotal = taxableBase + tax + shipping;

  return { subtotal, discount, tax, shipping, grandTotal };
}

// render cart + summary
function renderCart() {
  if (cart.length === 0) {
    cartTableBody.innerHTML = "";
    emptyCartHint.classList.remove("d-none");
  } else {
    emptyCartHint.classList.add("d-none");

    cartTableBody.innerHTML = cart
      .map((item) => {
        return `
        <tr>
          <td>
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="fw-semibold">${item.name}</div>
                <div class="small text-muted">${item.category}</div>
              </div>
            </div>
          </td>

          <td class="text-end money">${formatMoney(item.price)}</td>

          <td class="text-center">
            <div class="d-inline-flex align-items-center gap-2">
              <button class="btn btn-outline-secondary qty-btn"
                onclick="updateQty(${item.id}, ${item.qty - 1})">−</button>

              <input
                class="form-control form-control-sm text-center"
                style="width:60px;"
                type="number"
                min="1"
                value="${item.qty}"
                onchange="updateQty(${item.id}, parseInt(this.value || '1', 10))"
              />

              <button class="btn btn-outline-secondary qty-btn"
                onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
                 <button class="btn btn-outline-danger btn-sm ms-2" onclick="removeItem(${item.id})">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  renderSummary();
  cartWarning.classList.add("d-none");
}

function renderSummary() {
  const { subtotal, discount, tax, shipping, grandTotal } = computeTotals();

  summaryEl.innerHTML = `
    <div class="d-flex justify-content-between">
      <span class="text-muted">Subtotal</span>
      <span class="money">${formatMoney(subtotal)}</span>
    </div>

    <div class="d-flex justify-content-between">
      <span class="text-muted">Discount</span>
      <span class="money">-${formatMoney(discount)}</span>
    </div>

    <div class="d-flex justify-content-between">
      <span class="text-muted">Tax (12%)</span>
      <span class="money">${formatMoney(tax)}</span>
    </div>

    <div class="d-flex justify-content-between">
      <span class="text-muted">Shipping</span>
      <span class="money">${shipping === 0 ? "FREE" : formatMoney(shipping)}</span>
    </div>

    <hr class="my-2"/>

    <div class="d-flex justify-content-between fw-bold fs-5">
      <span>Grand Total</span>
      <span class="money">${formatMoney(grandTotal)}</span>
    </div>

    <div class="small text-muted mt-2">
      Discount Rule: 10% off if Subtotal ≥ ₱1000
      <br/>
      Shipping Rule: ₱80 if Subtotal &lt; ₱500, Free if Subtotal ≥ ₱500
    </div>
  `;
}

// form validation
function setupFormLogic() {
  deliveryOption.addEventListener("change", () => {
    if (deliveryOption.value === "Delivery") {
      addressGroup.style.display = "block";
      addressInput.setAttribute("required", "required");
    } else {
      addressGroup.style.display = "none";
      addressInput.removeAttribute("required");
      addressInput.value = "";
      addressInput.classList.remove("is-invalid");
    }
  });

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // cart must not be empty
    if (cart.length === 0) {
      cartWarning.classList.remove("d-none");
      return;
    }

    // bootstrap validation
    if (!checkoutForm.checkValidity()) {
      checkoutForm.classList.add("was-validated");
      return;
    }

    // if delivery selected, ensure address filled
    if (
      deliveryOption.value === "Delivery" &&
      addressInput.value.trim() === ""
    ) {
      addressInput.classList.add("is-invalid");
      checkoutForm.classList.add("was-validated");
      return;
    }

    checkoutForm.classList.add("was-validated");
    placeOrder();
  });
}

// modal of the receipot
function placeOrder() {
  const orderId = generateOrderId();
  const dateTime = nowString();

  const customerName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const payment = paymentMethod.value;
  const delivery = deliveryOption.value;
  const address = addressInput.value.trim();

  const totals = computeTotals();

  const itemsHtml = cart
    .map((item) => {
      const lineTotal = item.price * item.qty;
      return `
      <tr>
        <td>${item.name}</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-end money">${formatMoney(item.price)}</td>
        <td class="text-end money">${formatMoney(lineTotal)}</td>
      </tr>
    `;
    })
    .join("");

  receiptArea.innerHTML = `
    <div class="p-3">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h4 class="mb-1">Mini Checkout Receipt</h4>
          <div class="text-muted small">Order ID: <span class="fw-semibold">${orderId}</span></div>
          <div class="text-muted small">Date/Time: ${dateTime}</div>
        </div>
        <div class="text-end small">
          <div><span class="fw-semibold">Payment:</span> ${payment}</div>
          <div><span class="fw-semibold">Delivery:</span> ${delivery}</div>
        </div>
      </div>

      <hr />

      <div class="mb-2">
        <div><span class="fw-semibold">Customer:</span> ${customerName}</div>
        <div><span class="fw-semibold">Email:</span> ${email}</div>
        ${delivery === "Delivery" ? `<div><span class="fw-semibold">Address:</span> ${address}</div>` : ""}
      </div>

      <div class="table-responsive">
        <table class="table table-sm">
          <thead class="table-light">
            <tr>
              <th>Item</th>
              <th class="text-center">Qty</th>
              <th class="text-end">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <div class="row justify-content-end">
        <div class="col-md-6">
          <div class="d-flex justify-content-between">
            <span class="text-muted">Subtotal</span>
            <span class="money">${formatMoney(totals.subtotal)}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class="text-muted">Discount</span>
            <span class="money">-${formatMoney(totals.discount)}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class="text-muted">Tax (12%)</span>
            <span class="money">${formatMoney(totals.tax)}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class="text-muted">Shipping</span>
            <span class="money">${totals.shipping === 0 ? "FREE" : formatMoney(totals.shipping)}</span>
          </div>
          <hr class="my-2">
          <div class="d-flex justify-content-between fw-bold fs-5">
            <span>Grand Total</span>
            <span class="money">${formatMoney(totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      <div class="text-muted small mt-3">
        Thank you for your purchase!
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(receiptModal);
  modal.show();

  // reset cart and form after successful order
  cart = [];
  renderCart();

  checkoutForm.reset();
  checkoutForm.classList.remove("was-validated");
  addressGroup.style.display = "none";
  addressInput.removeAttribute("required");
}

// print button
function setupPrintButton() {
  printReceiptBtn.addEventListener("click", () => {
    window.print();
  });
}

// clear cart button
function setupClearCartButton() {
  clearCartBtn.addEventListener("click", () => {
    clearCart();
  });
}

function search() {
  searchInput.addEventListener("input", () => {
    renderProducts(searchInput.value.trim());
  });
}

// initializing.......................
renderProducts();
renderCart();
setupFormLogic();
setupPrintButton();
setupClearCartButton();
search();
