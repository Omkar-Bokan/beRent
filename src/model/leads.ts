import mongoose from 'mongoose';

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

export const Lead = mongoose.model('Lead', leadSchema);
