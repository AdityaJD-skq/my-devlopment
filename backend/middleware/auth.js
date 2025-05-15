import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if using mock database or real MongoDB
    const isDbConnected = req.app.locals.isDbConnected;
    const mockDb = req.app.locals.mockDb;
    
    let user;
    if (isDbConnected) {
      user = await User.findById(decoded.id);
    } else {
      user = mockDb.findUserById(decoded.id);
    }
    
    if (!user || !user.isActive) return res.status(401).json({ message: 'User not found or inactive' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 