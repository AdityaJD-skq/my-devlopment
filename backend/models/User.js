import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Developer', 'Admin', 'Teacher', 'Student'], default: 'Student' },
  isActive: { type: Boolean, default: true },
  registrationDate: { type: Date, default: Date.now },
  confirmationCode: { type: String },
  confirmationCodeExpires: { type: Date },
  isConfirmed: { type: Boolean, default: false }
});

export default mongoose.model('User', userSchema); 