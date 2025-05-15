import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { auth } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();

// Mock email storage for development
const mockEmails = {
  sent: [],
  getByEmail: (email) => mockEmails.sent.filter(mail => mail.to === email),
  getLatestByEmail: (email) => {
    const emails = mockEmails.sent.filter(mail => mail.to === email);
    return emails.length > 0 ? emails[emails.length - 1] : null;
  },
  add: (mail) => {
    mockEmails.sent.push({
      ...mail,
      id: `email_${Date.now()}`,
      sentAt: new Date()
    });
    // Keep only the latest 100 emails
    if (mockEmails.sent.length > 100) {
      mockEmails.sent = mockEmails.sent.slice(-100);
    }
    return mockEmails.sent[mockEmails.sent.length - 1];
  }
};

// Helper function to get the appropriate data access method based on DB connection
const getDataAccess = (req) => {
  const isDbConnected = req.app.locals.isDbConnected;
  const mockDb = req.app.locals.mockDb;
  
  return {
    isDbConnected,
    mockDb,
    
    // User methods
    findUserById: async (id) => {
      if (isDbConnected) {
        return await User.findById(id);
      } else {
        return mockDb.findUserById(id);
      }
    },
    
    findUserByEmail: async (email) => {
      if (isDbConnected) {
        return await User.findOne({ email });
      } else {
        return mockDb.findUserByEmail(email);
      }
    },
    
    createUser: async (userData) => {
      if (isDbConnected) {
        const user = new User(userData);
        return await user.save();
      } else {
        return mockDb.createUser(userData);
      }
    },
    
    updateUser: async (user) => {
      if (isDbConnected) {
        return await user.save();
      } else {
        return mockDb.updateUser(user.id, user);
      }
    },
    
    countUsers: async () => {
      if (isDbConnected) {
        return await User.countDocuments();
      } else {
        return mockDb.countUsers();
      }
    },
    
    // Activity log methods
    logActivity: async (userId, type, details, req) => {
      try {
        if (isDbConnected) {
          const log = new ActivityLog({
            userId,
            type,
            details,
            ipAddress: req?.ip,
            userAgent: req?.headers['user-agent'],
            performedBy: userId
          });
          await log.save();
        } else {
          mockDb.createActivityLog({
            userId,
            type,
            details,
            ipAddress: req?.ip,
            userAgent: req?.headers['user-agent'],
            performedBy: userId
          });
        }
      } catch (err) {
        console.error('Error logging activity:', err);
      }
    }
  };
};

// Helper function for sending emails - either real or mock in development
const sendEmail = async (to, subject, text) => {
  // Check if we're in development mode and using ethereal/test email
  if (process.env.NODE_ENV === 'development' && process.env.SMTP_HOST.includes('ethereal')) {
    console.log('-------------MOCK EMAIL-------------');
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CONTENT: ${text}`);
    console.log('-----------------------------------');
    
    // Store in mock email system
    mockEmails.add({ to, subject, text });
    return true;
  }
  
  // Real email sending
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text
    });
    
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// GET /api/auth/mockEmails - Get mock emails for development
router.get('/mockEmails', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ message: 'Not available in production' });
  }
  
  const { email } = req.query;
  if (email) {
    const emails = mockEmails.getByEmail(email);
    return res.json(emails);
  }
  
  res.json(mockEmails.sent);
});

// GET /api/auth/latestCode - Get latest confirmation code for an email
router.get('/latestCode', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ message: 'Not available in production' });
  }
  
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: 'Email parameter is required' });
  }
  
  const latestEmail = mockEmails.getLatestByEmail(email);
  if (!latestEmail) {
    return res.status(404).json({ message: 'No emails found for this address' });
  }
  
  // Extract code from email text using regex
  const codeMatch = latestEmail.text.match(/code is: (\d+)/);
  const code = codeMatch ? codeMatch[1] : null;
  
  res.json({
    email: latestEmail.to,
    subject: latestEmail.subject,
    code,
    sentAt: latestEmail.sentAt
  });
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = getDataAccess(req);
    
    const userExists = await db.findUserByEmail(email);
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    // Check if first user - make them a Developer
    const userCount = await db.countUsers();
    const devEmails = (process.env.DEVELOPER_EMAILS || '').split(',').map(e => e.trim());
    const isDeveloperEmail = devEmails.includes(email.toLowerCase());
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate confirmation code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    // Create new user
    const user = await db.createUser({
      name,
      email,
      password: hashedPassword,
      role: userCount === 0 || isDeveloperEmail ? 'Developer' : 'Student',
      confirmationCode: code,
      confirmationCodeExpires: codeExpiry,
      isActive: true,
      isConfirmed: false
    });
    
    // Send email using our helper function
    await sendEmail(
      user.email,
      'Confirm Your JEE/NEET Prep Account',
      `Your confirmation code is: ${code}`
    );
    
    // Log activity
    await db.logActivity(user._id || user.id, 'signup', { name, email }, req);
    
    res.status(201).json({ message: 'User registered. Please check your email for confirmation code.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/confirm-signup
router.post('/confirm-signup', async (req, res) => {
  try {
    const { email, code } = req.body;
    const db = getDataAccess(req);
    const user = await db.findUserByEmail(email);
    if (!user || !user.confirmationCode || !user.confirmationCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    if (user.confirmationCode !== code || user.confirmationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    user.isConfirmed = true;
    user.confirmationCode = undefined;
    user.confirmationCodeExpires = undefined;
    await db.updateUser(user);
    
    // Log activity
    await db.logActivity(user._id, 'signup', { confirmed: true }, req);
    
    res.json({ message: 'Signup confirmed. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDataAccess(req);
    const user = await db.findUserByEmail(email);
    if (!user || !user.isActive) return res.status(400).json({ message: 'Invalid credentials or inactive account' });
    if (!user.isConfirmed) return res.status(400).json({ message: 'Please confirm your email before logging in.' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Log activity
    await db.logActivity(user._id, 'login', {
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }, req);
    
    // Send user info and token
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', auth, async (req, res) => {
  try {
    // Log activity
    const db = getDataAccess(req);
    await db.logActivity(req.user._id, 'logout', {
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }, req);
    
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const db = getDataAccess(req);
    const user = await db.findUserById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/request-password-reset
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    const db = getDataAccess(req);
    const user = await db.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Generate reset code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.confirmationCode = code;
    user.confirmationCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await db.updateUser(user);
    
    // Send email using our helper function
    await sendEmail(
      user.email,
      'Reset Your Password',
      `Your password reset code is: ${code}`
    );
    
    // Log activity
    await db.logActivity(user._id, 'password_reset', { requested: true }, req);
    
    res.json({ message: 'Password reset code sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const db = getDataAccess(req);
    const user = await db.findUserByEmail(email);
    if (!user || !user.confirmationCode || !user.confirmationCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    if (user.confirmationCode !== code || user.confirmationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    user.confirmationCode = undefined;
    user.confirmationCodeExpires = undefined;
    await db.updateUser(user);
    
    // Log activity
    await db.logActivity(user._id, 'password_reset', { completed: true }, req);
    
    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/resend-confirmation
router.post('/resend-confirmation', async (req, res) => {
  try {
    const { email } = req.body;
    const db = getDataAccess(req);
    const user = await db.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isConfirmed) return res.status(400).json({ message: 'Email already confirmed' });
    
    // Generate new confirmation code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    user.confirmationCode = code;
    user.confirmationCodeExpires = codeExpiry;
    await db.updateUser(user);
    
    // Send email using our helper function
    await sendEmail(
      user.email,
      'Confirm Your JEE/NEET Prep Account',
      `Your new confirmation code is: ${code}`
    );
    
    // Log activity
    await db.logActivity(user._id, 'confirmation_resend', { email }, req);
    
    res.json({ message: 'New confirmation code sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 