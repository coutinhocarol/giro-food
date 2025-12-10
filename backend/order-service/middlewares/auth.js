const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('DEBUG AUTH: Header Authorization recebido:', authHeader);
  if (!authHeader) return res.status(401).json({ message: 'Nenhum token fornecido' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Erro de token' });
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Token no formato errado' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });
    req.userId = decoded.id; 
    next();
  });
};

module.exports = authMiddleware;