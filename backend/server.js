// backend/server.js – Version finale pour Render + PostgreSQL externe
const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connexion à la base PostgreSQL Render (ou locale si pas de variables)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    "postgresql://admin:secret@localhost:5432/mydb",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Init DB au démarrage (une seule fois)
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
    console.log("Base de données initialisée");
  } catch (err) {
    console.error("Erreur init DB:", err.message);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    project: "TP CI/CD Complet", 
    status: "Deployé sur Render + Vercel",
    frontend: "https://ton-frontend.vercel.app"
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: "Hello from Backend – TP CI/CD 2025 !",
    deployed_on: "Render.com",
    author: "Oussama Ben Youssef",
    timestamp: new Date().toISOString()
  });
});

app.get('/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json({ 
      message: "Données depuis PostgreSQL Render", 
      data: result.rows,
      success: true 
    });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
});

// Démarrage
app.listen(PORT, async () => {
  console.log(`Backend sur le port ${PORT}`);
  await initDB();
});