import express from 'express';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { auth } from '../middleware/auth.js';
import { requireRole, canAssignRole, canModifyUser } from '../middleware/role.js';

const router = express.Router();

// GET /api/admin/users - Get all users (Developer & Admin only)
router.get('/users', auth, requireRole('Developer', 'Admin'), async (req, res) => {
  try {
    const { role, isActive, search } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(filter).select('-password').sort({ registrationDate: -1 });
    
    // Log this activity
    const log = new ActivityLog({
      userId: req.user._id,
      type: 'user_management',
      details: { action: 'list_users', filter: req.query },
      performedBy: req.user._id
    });
    await log.save();
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/users/:id - Get specific user (with role-based permission)
router.get('/users/:id', auth, canModifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/admin/users/:id/role - Update user role (Developer, Admin with restrictions)
router.put('/users/:id/role', auth, requireRole('Developer', 'Admin'), canModifyUser, canAssignRole, async (req, res) => {
  try {
    const { role } = req.body;
    const user = req.targetUser;
    
    // Store old role for logging
    const oldRole = user.role;
    user.role = role;
    await user.save();
    
    // Log this activity
    const log = new ActivityLog({
      userId: user._id,
      type: 'role_changed',
      details: { oldRole, newRole: role },
      performedBy: req.user._id
    });
    await log.save();
    
    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/admin/users/:id/status - Update user active status (Developer, Admin with restrictions)
router.put('/users/:id/status', auth, requireRole('Developer', 'Admin'), canModifyUser, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = req.targetUser;
    
    // Store old status for logging
    const oldStatus = user.isActive;
    user.isActive = isActive;
    await user.save();
    
    // Log this activity
    const log = new ActivityLog({
      userId: user._id,
      type: 'status_changed',
      details: { oldStatus, newStatus: isActive },
      performedBy: req.user._id
    });
    await log.save();
    
    res.json({ message: 'User status updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/admin/users/:id - Delete user (Developer only)
router.delete('/users/:id', auth, requireRole('Developer'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Log this activity before deletion
    const log = new ActivityLog({
      userId: req.user._id,
      type: 'user_deleted',
      details: { deletedUser: { id: user._id, email: user.email, role: user.role } },
      performedBy: req.user._id
    });
    await log.save();
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/users/:id/activity - Get user activity logs (role-based permissions)
router.get('/users/:id/activity', auth, canModifyUser, async (req, res) => {
  try {
    const { startDate, endDate, type, limit = 50 } = req.query;
    const filter = { userId: req.params.id };
    
    if (type) filter.type = type;
    if (startDate || endDate) filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate);
    if (endDate) filter.timestamp.$lte = new Date(endDate);
    
    const logs = await ActivityLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('performedBy', 'name email role');
    
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/activity - Get all activity logs (Developer and Admin only)
router.get('/activity', auth, requireRole('Developer', 'Admin'), async (req, res) => {
  try {
    const { user, type, startDate, endDate, limit = 100, page = 1 } = req.query;
    const filter = {};
    
    if (user) filter.userId = user;
    if (type) filter.type = type;
    if (startDate || endDate) filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate);
    if (endDate) filter.timestamp.$lte = new Date(endDate);
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const logs = await ActivityLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email role')
      .populate('performedBy', 'name email role');
    
    const total = await ActivityLog.countDocuments(filter);
    
    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/dashboard - Get admin dashboard data (Developer, Admin only)
router.get('/dashboard', auth, requireRole('Developer', 'Admin'), async (req, res) => {
  try {
    // User counts by role
    const userCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    // Recent activity
    const recentActivity = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'name email role')
      .populate('performedBy', 'name email role');
    
    // User registration over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const registrations = await User.aggregate([
      { $match: { registrationDate: { $gte: thirtyDaysAgo } } },
      { $group: { 
        _id: { 
          $dateToString: { format: '%Y-%m-%d', date: '$registrationDate' } 
        },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      userCounts,
      recentActivity,
      registrations
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/teacher/students - Get students for teacher (Teacher, Admin, Developer)
router.get('/teacher/students', auth, requireRole('Developer', 'Admin', 'Teacher'), async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' })
      .select('-password')
      .sort({ name: 1 });
    
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 