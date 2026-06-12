require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const authRouter = require('./auth');
const authMiddleware = require('./middleware');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/auth', authRouter);

// Отладка
const dbUrl = process.env.DATABASE_URL;
console.log('DATABASE_URL начало:', dbUrl ? dbUrl.substring(0, 30) : 'ОТСУТСТВУЕТ');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at ASC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/tasks', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Текст обязателен' });
    const result = await pool.query(
      'INSERT INTO tasks (text, user_id) VALUES ($1, $2) RETURNING *',
      [text, req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE tasks SET done = NOT done WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Не найдена' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    res.json({ message: 'Удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
