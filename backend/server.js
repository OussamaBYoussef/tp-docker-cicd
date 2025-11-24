const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS PARFAIT – fonctionne partout
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function init() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT)`);
    await pool.query(`INSERT INTO users(name) VALUES('Alice'),('Bob') ON CONFLICT DO NOTHING`);
  } catch (e) { console.error(e); }
}

app.get('/api', (req, res) => {
  res.json({ message: "Hello from Render !", author: "Oussama Ben Youssef", time: new Date().toISOString() });
});

app.get('/db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend live → https://tp-docker-cicd-2.onrender.com`);
  init();
});