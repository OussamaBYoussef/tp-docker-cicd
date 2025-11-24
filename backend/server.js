// backend/server.js – Version finale 100 % fonctionnelle (Render + Vercel)
const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS : obligatoire pour que Vercel puisse appeler Render
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // ou ton domaine Vercel
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();
    next();
});

app.use(express.json());

// Connexion DB
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Init DB au démarrage
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
        console.log('Base de données initialisée avec succès');
    } catch (err) {
        console.error('Erreur init DB :', err.message);
    }
}

// Routes
app.get('/', (req, res) => {
    res.json({ 
        project: "TP CI/CD Complet", 
        status: "OK", 
        deployed: "Render + Vercel",
        author: "Oussama Ben Youssef"
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
        const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Démarrage
app.listen(PORT, () => {
    console.log(`Backend en ligne sur le port ${PORT}`);
    initDB();
});