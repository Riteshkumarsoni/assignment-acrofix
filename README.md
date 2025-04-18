# 🥦 Bulk Vegetables Ordering Web App

A full-stack web application for bulk ordering vegetables and fruits, built using **Node.js**, **React.js**, **JWT Authentication**, and **Neon.tech** (PostgreSQL).

---
## Install all the dependencies
- npm install

## start the project
- npm start

## 🚀 Features

### 👩‍💼 Admin Panel
- **JWT-protected access** (stored in **HTTP-only cookies**).
- Admin can:
  - Log in securely.
  - Add new products (with images/logos).
  - Update product status: `Pending`, `In Progress`, `Delivered`.
  - Also use ProtectedRoute for admin dashboard without login the user cannot access the dashboard

### 🛍️ User Interface
- View all available products in a **Product Catalogue**.
- Click **Buy** to place an order.
- Redirected to an **Order Placement Page**.
- Track order status using **Order ID**.

---

## 🧱 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via [Neon.tech](https://neon.tech))
- **Authentication**: JWT stored in cookies
- **Deployment**: (Mention if applicable)

---

## 🗂️ Database Structure

### 1. `admin` Table
- `id`, `username`, `password_hash`, `created_at`

### 2. `product` Table
- `id`, `name`, `logo_url`, `status`, `created_by`

### 3. `orders` Table
- `id`, `product_id`, `user_name`, `order_status`, `created_at`

---

## 📦 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/bulk-vegetables-app.git
cd bulk-vegetables-app
