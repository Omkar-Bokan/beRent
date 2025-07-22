import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    phone: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    photo: { type: String },
    date: { type: Date, default: Date.now }
});

export default mongoose.model("Profile", profileSchema);