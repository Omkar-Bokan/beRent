import mongoose from 'mongoose';

const adminProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Admin name is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true, // Email should be unique for the admin profile
        match: [/.+@.+\..+/, 'Please use a valid email address.']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required.'],
        unique: true // Phone number should also be unique
    },
    role: {
        type: String,
        enum: {
            values: ['superadmin', 'admin', 'manager'],
            message: 'Role must be superadmin, admin, or manager.'
        },
        default: 'admin',
        required: [true, 'Role is required.']
    },
    joinDate: { // This will be set automatically on creation
        type: Date,
        default: Date.now
    },
    // Optional fields for statistics or avatar, not directly from initial form
    properties: { type: Number, default: 0 },
    totalBeds: { type: Number, default: 0 },
    avatar: { type: String, default: '' }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

export const AdminProfile = mongoose.model('AdminProfile', adminProfileSchema);