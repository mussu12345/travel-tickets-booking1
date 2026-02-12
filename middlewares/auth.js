const jwt = require('jsonwebtoken');
const User = require('../Backend/models/user');


exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select('-password');
    if(!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

exports.admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  next();
};
