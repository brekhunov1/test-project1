// server.js
// lesson 5
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware — позволяет читать JSON из тела запроса
app.use(express.json());

// База данных пока в памяти
let tasks = [
  { id: 1, text: 'Выучить Express', done: false },
  { id: 2, text: 'Написать API', done: false },
];

// TODO: GET /tasks — вернуть все задачи
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// TODO: GET /tasks/:id — вернуть одну задачу по id
//   если не найдена → статус 404, { error: 'Задача не найдена' }
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }
  res.json(task);
});

// TODO: POST /tasks — создать новую задачу
//   тело запроса: { text: 'Название задачи' }
//   если text пустой → статус 400, { error: 'Текст задачи обязателен' }
//   вернуть созданную задачу со статусом 201
app.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (!text) {
	return res.status(400).json({ error: 'Текст задачи обязателен' });
  }
  const newTask = { id: Date.now(), text, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// TODO: DELETE /tasks/:id — удалить задачу по id
//   если не найдена → статус 404
//   если удалена → { message: 'Задача удалена' }
app.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }
  tasks.splice(taskIndex, 1);
  res.json({ message: 'Задача удалена' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
