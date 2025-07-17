import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
});

const leadSchema = new mongoose.Schema({
  
  name: String,
  phone: String,
  email: String,
  location: String,
  budget: Number,
  moveInDate: Date,
  priority: { type: String, enum: ['Low', 'Medium', 'High'] },
  source: String,
  requirements: String,
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);


export const Lead = mongoose.model('Lead', leadSchema);