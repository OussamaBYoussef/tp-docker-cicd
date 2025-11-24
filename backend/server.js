const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api', (req, res) => {
  res.json({
    message: "Hello from Backend – TP CI/CD 2025 !",
    status: "OK",
    timestamp: new Date().toISOString(),
    author: "It's me"
  });
});

app.get('/', (req, res) => {
  res.json({ project: "TP CI/CD – Frontend + Backend", status: "running" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});