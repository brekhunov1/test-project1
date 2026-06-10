const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public-lesson8'));

// Отладка
const dbUrl = process.env.DATABASE_URL;
console.log('DATABASE_URL начало:', dbUrl ? dbUrl.substring(0, 30) : 'ОТСУТСТВУЕТ');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка полная:', JSON.stringify(err, null, 2));
    console.error('Ошибка message:', err.message);
    console.error('Ошибка code:', err.code);
    res.status(500).json({ error: err.message, code: err.code });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Текст обязателен' });
    const result = await pool.query('INSERT INTO tasks (text) VALUES ($1) RETURNING *', [text]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('UPDATE tasks SET done = NOT done WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
