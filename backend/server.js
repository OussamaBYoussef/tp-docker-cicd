// backend/server.js – VERSION FINALE QUI MARCHE À COUP SÛR
const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS ULTRA-EFFICACE (cette version ne rate JAMAIS)
const cors = require('cors');
app.use(cors());                              // ← LIGNE MAGIQUE
app.use(express.json());

// DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Init DB
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE
      )
    `);
    await pool.query(`
      INSERT INTO users (name, email) 
      VALUES ('Alice', 'alice@example.com'), ('Bob', 'bob@example.com')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('DB initialisée');
  } catch (e) { console.error(e); }
}

// Routes
app.get('/', (req, res) => res.json({ status: "Backend OK", platform: "Render" }));
app.get('/api', (req, res) => res.json({
  message: "Hello from Render !",
  author: "Oussama Ben Youssef",
  time: new Date().toISOString()
}));
app.get('/db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend live sur le port ${PORT}`);
  initDB();
});