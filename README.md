# Mini E-Commerce Checkout System

A school activity simple, single-page e-commerce checkout system built with **HTML**, **CSS**, **JavaScript**, and **Bootstrap 5**. Browse Samsung products, manage a shopping cart, and complete checkout with a generated receipt.

---

## Features

### Product Catalog
- Displays 8 Samsung products (phones & tablets) as responsive cards
- Each card shows the product image, name, category, and price
- **Real-time search** — filter products by name or category as you type

### Shopping Cart
- Add products to the cart with a single click
- Increment / decrement quantity with **+** and **−** buttons or type a value manually
- Remove individual items with the **✕** button
- **Clear cart** with a confirmation dialog to prevent accidental deletion
- Empty cart message shown when no items are added

### Pricing Rules
| Rule | Condition | Value |
|------|-----------|-------|
| **Discount** | Subtotal ≥ ₱1,000 | 10% off |
| **Tax** | Always | 12% VAT on discounted subtotal |
| **Shipping** | Subtotal ≥ ₱500 | FREE |
| **Shipping** | Subtotal < ₱500 | ₱80 |

### Checkout Form
- Customer name and email (required)
- Payment method selection (Cash, GCash, Credit Card)
- Delivery option (Pickup or Delivery)
- Address field appears only when **Delivery** is selected
- Bootstrap form validation with error messages

### Receipt
- Generated in a Bootstrap modal after successful checkout
- Displays order ID (`ORD-YYYY-000000`), date/time, customer info
- Itemized table with quantities and prices
- Full pricing breakdown (subtotal, discount, tax, shipping, grand total)
- **Print** button to print or save the receipt as PDF

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure |
| **CSS3** | Custom styling (`style.css`) |
| **Bootstrap 5.3** | Responsive layout, components, modals, form validation |
| **Vanilla JavaScript** | All application logic (`script.js`) |

---

## Project Structure

```
mini-ecommerce/
├── assets/                 # Product images
│   ├── s23.png
│   ├── s24.png
│   ├── s24u.png
│   ├── s25u.png
│   ├── zflip7.png
│   ├── zfold7.png
│   ├── tab-s10-fe-plus.png
│   └── tab-s11u.png
├── index.html              # Main HTML page
├── style.css               # Custom styles
├── script.js               # Application logic
└── README.md               # Project documentation

```

---

## Getting Started

1. **Clone or download** the repository:
   ```bash
   git clone https://github.com/your-username/mini-ecommerce.git
   ```

2. **Open** `index.html` in your browser — no build tools or server required.

3. **Browse** products, add items to the cart, and complete a checkout.

---

## How It Works

1. **Browse** — Products are rendered from a JavaScript array. Use the search bar to filter by name or category.
2. **Add to Cart** — Click "Add to Cart" on any product. If already in the cart, the quantity increments.
3. **Manage Cart** — Adjust quantities with +/− buttons, type a value, or remove items with ✕. Clear all items with the "Clear Cart" button (requires confirmation).
4. **Checkout** — Fill in the form and submit. Validation ensures all required fields are completed.
5. **Receipt** — A modal displays the full order receipt. Click "Print" to print or save as PDF.

---

## Currency

All prices are in **Philippine Peso (₱)** formatted using `Intl.NumberFormat("en-PH")`.
