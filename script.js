
// Product Data
const products = [
  { id: 1, image: "https://i5.walmartimages.com/seo/Wireless-Gaming-Mouse-Laptop-TSV-Rechargeable-USB-2-4G-PC-5-Adjustable-DPI-7-Colors-LED-Lights-6-Silent-Buttons-Ergonomic-Optical-Computer-Desktop-Ma_8c2707d9-286f-440f-8a7f-8639ccb6e247_1.6e24c983626322e82e3fb15f4ed7e13a.jpeg" ,name: "Gaming Mouse", price: 299.00, category: "Computer" },

];

// Cart state: {id, img, name, price, cat, qty}
let cart = [];

// used for order numbering 
let orderCounter = 0; 

// helpers

function formatMoney(n) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
}

function nowString() {
  return new Date().toLocaleString("en-PH", { hour12: true });
}

function generateOrderId() {
  orderCounter += 1;
  const year = new Date().getFullYear();
  return `ORD-${year}-${String(orderCounter).padStart(6, "0")}`; // it is formatted as ORD-YYYY-000000 (ord id)
}


// render prod

function renderProducts() {
  const productList = document.getElementById("productList");
  const badge = document.getElementById("productCountBadge");
  badge.textContent = `${products.length} items`;

  productList.innerHTML = products.map(p => `
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
  `).join("");
}

// card--

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

// UPDATE QUANTITY
function updateQty(productId, newQty) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  if (newQty <= 0) {
    removeItem(productId);
    return;
  }

  item.qty = newQty;
  renderCart();
}

function removeItem(productId) {
  cart = cart.filter(i => i.id !== productId);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

//  computations

function computeTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const discount = subtotal >= 1000 ? subtotal * 0.10 : 0;

  const taxableBase = Math.max(subtotal - discount, 0);
  const tax = taxableBase * 0.12;

  const shipping = subtotal >= 500 ? 0 : (subtotal > 0 ? 80 : 0);

  const grandTotal = taxableBase + tax + shipping;

  return { subtotal, discount, tax, shipping, grandTotal };
}

// render cart + summary
function renderCart() {
  const tbody = document.getElementById("cartTableBody");
  const emptyHint = document.getElementById("emptyCartHint");

  if (cart.length === 0) {
    tbody.innerHTML = "";
    emptyHint.classList.remove("d-none");
  } else {
    emptyHint.classList.add("d-none");

    tbody.innerHTML = cart.map(item => {
      const lineTotal = item.price * item.qty;

      return `
        <tr>
          <td>
            <div class="fw-semibold">${item.name}</div>
            <div class="small text-muted">${item.category}</div>
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
            </div>
          </td>

          <td class="text-end money">${formatMoney(lineTotal)}</td>

          <td class="text-center">
            <button class="btn btn-outline-danger btn-sm" onclick="removeItem(${item.id})">
              ✕
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  renderSummary();
  document.getElementById("cartWarning").classList.add("d-none");
}

function renderSummary() {
  const summary = document.getElementById("summary");
  const { subtotal, discount, tax, shipping, grandTotal } = computeTotals();

  summary.innerHTML = `
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
  const form = document.getElementById("checkoutForm");
  const deliveryOption = document.getElementById("deliveryOption");
  const addressGroup = document.getElementById("addressGroup");
  const address = document.getElementById("address");
  const cartWarning = document.getElementById("cartWarning");

  deliveryOption.addEventListener("change", () => {
    if (deliveryOption.value === "Delivery") {
      addressGroup.style.display = "block";
      address.setAttribute("required", "required");
    } else {
      addressGroup.style.display = "none";
      address.removeAttribute("required");
      address.value = "";
      address.classList.remove("is-invalid");
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // cart must not be empty
    if (cart.length === 0) {
      cartWarning.classList.remove("d-none");
      return;
    }

    // bootstrap validation
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // if delivery selected, ensure address filled
    if (deliveryOption.value === "Delivery" && address.value.trim() === "") {
      address.classList.add("is-invalid");
      form.classList.add("was-validated");
      return;
    }

    form.classList.add("was-validated");
    placeOrder();
  });
}

// modal of the receipot
function placeOrder() {
  const orderId = generateOrderId();
  const dateTime = nowString();

  const customerName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const payment = document.getElementById("paymentMethod").value;
  const delivery = document.getElementById("deliveryOption").value;
  const address = document.getElementById("address").value.trim();

  const totals = computeTotals();

  const itemsHtml = cart.map(item => {
    const lineTotal = item.price * item.qty;
    return `
      <tr>
        <td>${item.name}</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-end money">${formatMoney(item.price)}</td>
        <td class="text-end money">${formatMoney(lineTotal)}</td>
      </tr>
    `;
  }).join("");

  document.getElementById("receiptArea").innerHTML = `
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
              <th class="text-end">Line Total</th>
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

  const modalEl = document.getElementById("receiptModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  // reset cart and form after successful order
  cart = [];
  renderCart();

  const form = document.getElementById("checkoutForm");
  form.reset();
  form.classList.remove("was-validated");
  document.getElementById("addressGroup").style.display = "none";
  document.getElementById("address").removeAttribute("required");
}

// print button
function setupPrintButton() {
  document.getElementById("printReceiptBtn").addEventListener("click", () => {
    window.print();
  });
}

// clear cart button
function setupClearCartButton() {
  document.getElementById("clearCartBtn").addEventListener("click", () => {
    clearCart();
  });
}

// initializing.......................
renderProducts();
renderCart();
setupFormLogic();
setupPrintButton();
setupClearCartButton();
