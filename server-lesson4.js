// server.js
// lesson 4
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // TODO: добавь заголовок Content-Type: application/json
  // подсказка: res.setHeader('Content-Type', '...')
  res.setHeader('Content-Type', 'application/json');

  // TODO: сделай роутинг по req.url:
  // GET /         → { message: 'Привет от сервера!' }
  // GET /users    → массив из 3 пользователей [{ id, name }]
  // любой другой  → статус 404, { error: 'Страница не найдена' }
	if (req.method === 'GET' && req.url === '/') {
		res.writeHead(200);
		res.end(JSON.stringify({ message: 'Привет от сервера!' }));
	} else if (req.method === 'GET' && req.url === '/users') {
		res.writeHead(200);
		res.end(JSON.stringify([
			{ id: 1, name: 'John Doe' },
			{ id: 2, name: 'Jane Smith' },
			{ id: 3, name: 'Bob Johnson' }
		]));
	} else {
		res.writeHead(404);
		res.end(JSON.stringify({ error: 'Страница не найдена' }));
	}

  // подсказка: ответ отправляется через
  // res.writeHead(200)  ← статус
  // res.end(JSON.stringify({ ... }))  ← тело
});

server.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
