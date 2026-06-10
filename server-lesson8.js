const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public-lesson8')); // ← отдаёт файлы из папки public

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/tasks', async (req, res) => {
  // TODO: SELECT * FROM tasks ORDER BY id
  const result = await pool.query('SELECT * FROM tasks ORDER BY id');
  res.json(result.rows);
});

app.post('/tasks', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Текст обязателен' });
  // TODO: INSERT INTO tasks (text) VALUES ($1) RETURNING *
  const result = await pool.query('INSERT INTO tasks (text) VALUES ($1) RETURNING *', [text]);
  res.status(201).json(result.rows[0]);
});

app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  // TODO: UPDATE tasks SET done = NOT done WHERE id = $1 RETURNING *
  const result = await pool.query('UPDATE tasks SET done = NOT done WHERE id = $1 RETURNING *', [id]);
  res.json(result.rows[0]);
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  // TODO: DELETE FROM tasks WHERE id = $1
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  res.json({ message: 'Удалена' });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
