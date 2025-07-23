import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for your AdminProfile document
export interface IAdminProfile extends Document {
    name: string;
    email: string;
    phone: string;
    role: 'superadmin' | 'admin' | 'manager';
    joinDate: Date;
    properties: number;
    totalBeds: number;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;

    // _id?: mongoose.Types.ObjectId;
    // __v?: number;
}

const adminProfileSchema: Schema<IAdminProfile> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Admin name is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        match: [/.+@.+\..+/, 'Please use a valid email address.']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required.'],
        unique: true
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
    joinDate: {
        type: Date,
        default: Date.now
    },
    properties: { type: Number, default: 0 },
    totalBeds: { type: Number, default: 0 },
    avatar: { type: String, default: '' }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {

            const transformedRet = ret as any;

            if (transformedRet._id) {
                transformedRet.id = transformedRet._id.toString();
            }
            delete transformedRet._id;
            delete transformedRet.__v;
            return transformedRet;
        }
    },
    toObject: {
        virtuals: true,
        transform: (doc, ret) => {
            const transformedRet = ret as any;

            if (transformedRet._id) {
                transformedRet.id = transformedRet._id.toString();
            }
            delete transformedRet._id;
            delete transformedRet.__v;
            return transformedRet;
        }
    }
});

export const AdminProfile = mongoose.model<IAdminProfile>('AdminProfile', adminProfileSchema);