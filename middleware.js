// middleware.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecret';

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: 'Токен отсутствует' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Токен недействителен' });
  }
}

module.exports = authMiddleware;
