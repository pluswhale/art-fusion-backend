const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants').default;

function verifyToken (req, res, next)  {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next(); // move on to the next middleware
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = { verifyToken };