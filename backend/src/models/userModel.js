const db = require('../config/db');

async function findByEmail(email) {
  const { rows } = await db.query('SELECT id, name, phone, email, password, created_at FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

async function createUser({ name, phone, email, passwordHash }) {
  const { rows } = await db.query(
    `INSERT INTO users (name, phone, email, password, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, name, phone, email, created_at`,
    [name, phone, email, passwordHash]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await db.query('SELECT id, name, phone, email, created_at FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = { findByEmail, createUser, findById };