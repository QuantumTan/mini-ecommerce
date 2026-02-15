# Mini Checkout System

A school activity lightweight e-commerce checkout system built with vanilla JavaScript, HTML, and CSS.

## Features

- **Product Catalog** — Browse products displayed as responsive cards with images, prices, and categories.
- **Shopping Cart** — Add items, adjust quantities, and remove products with real-time updates.
- **Order Summary** — Automatic calculation of subtotal, discount, tax (12% VAT), and shipping.
- **Checkout Form** — Validated form with support for multiple payment methods and delivery options.
- **Receipt Generation** — Order receipt displayed in a modal with a print option.

## Pricing Rules

| Rule | Condition | Effect |
|------|-----------|--------|
| Discount | Subtotal ≥ ₱1,000 | 10% off |
| Shipping | Subtotal ≥ ₱500 | Free |
| Shipping | Subtotal < ₱500 | ₱80 |

## Tech Stack

- **HTML5**
- **CSS3** with custom styles
- **JavaScript** (ES6+, no frameworks)
- **Bootstrap 5.3** for layout and components

## Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Open `index.html` in a browser — no build step required.

## Project Structure

```
mini-ecommerce/
├── index.html    # Main page with product list, cart, checkout form, and receipt modal
├── style.css     # Custom styles
├── script.js     # All application logic (cart, totals, form validation, receipt)
└── README.md
```
