const db = require('../config/db');

async function createProduct({ name, price, image_url, user_id }) {
  const { rows } = await db.query(
    `INSERT INTO products (name, price, image_url, user_id, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, name, price, image_url, user_id, created_at`,
    [name, price, image_url, user_id]
  );
  return rows[0];
}

async function listProductsWithSeller() {
  const { rows } = await db.query(
    `SELECT p.id, p.name, p.price, p.image_url, p.created_at,
            u.id AS seller_id, u.name AS seller_name, u.phone AS seller_phone
     FROM products p
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`
  );
  return rows;
}

async function getProductWithSellerById(id) {
  const { rows } = await db.query(
    `SELECT p.id, p.name, p.price, p.image_url, p.user_id, p.created_at,
            u.id AS seller_id, u.name AS seller_name, u.phone AS seller_phone, u.email AS seller_email
     FROM products p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { createProduct, listProductsWithSeller, getProductWithSellerById };