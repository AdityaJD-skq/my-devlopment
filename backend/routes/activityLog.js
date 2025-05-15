import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/activity-log
router.post('/', auth, async (req, res) => {
  const { type, details } = req.body;
  const log = new ActivityLog({
    userId: req.user._id,
    type,
    details
  });
  await log.save();
  res.status(201).json({ message: 'Activity logged', log });
});

export default router; 