import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
});

export default mongoose.model('User', userSchema);
