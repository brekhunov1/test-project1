const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public-lesson6')); // ← отдаёт файлы из папки public

let tasks = [
  { id: 1, text: 'Выучить Express', done: false },
  { id: 2, text: 'Написать API', done: false },
];

app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Текст обязателен' });
  const newTask = { id: Date.now(), text, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// TODO: PATCH /tasks/:id — переключить done (true/false)
//   найди задачу по id
//   переключи task.done = !task.done
//   верни обновлённую задачу
app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Не найдена' });
  task.done = !task.done;
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Не найдена' });
  tasks.splice(index, 1);
  res.json({ message: 'Удалена' });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
