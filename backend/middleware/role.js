export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient role' });
  }
  next();
};

export const canAssignRole = (req, res, next) => {
  const { role } = req.body;
  if (role === 'Developer' && req.user.role !== 'Developer') {
    return res.status(403).json({ message: 'Only Developer can assign Developer role.' });
  }
  
  // Additional rules - Admins can't modify Developer accounts
  if (req.user.role === 'Admin') {
    const targetUser = req.targetUser; // Set by previous middleware
    if (targetUser && targetUser.role === 'Developer') {
      return res.status(403).json({ message: 'Admin cannot modify Developer accounts' });
    }
  }
  
  next();
};

// Utility to check if user can modify another user based on role hierarchy
export const canModifyUser = async (req, res, next) => {
  const targetUserId = req.params.id;
  if (!targetUserId) return next();
  
  try {
    const User = req.app.locals.models.User; // Access User model
    const targetUser = await User.findById(targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Developer can modify anyone
    if (req.user.role === 'Developer') {
      req.targetUser = targetUser;
      return next();
    }
    
    // Admin can modify anyone except Developer
    if (req.user.role === 'Admin' && targetUser.role !== 'Developer') {
      req.targetUser = targetUser;
      return next();
    }
    
    // Teacher can view student data but not modify roles
    if (req.user.role === 'Teacher' && targetUser.role === 'Student' && req.method === 'GET') {
      req.targetUser = targetUser;
      return next();
    }
    
    return res.status(403).json({ message: 'You do not have permission to modify this user' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 