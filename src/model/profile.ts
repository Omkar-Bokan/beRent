import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for your Profile document
export interface IProfile extends Document {
    phone?: string; // Made optional as it might be added later for Google users
    name: string; // Required
    email: string; // Required
    role: string;
    photo?: string;
    date?: Date; // Made optional, consider if still needed or if createdAt is sufficient
    preferences: { // Added preferences object
        budget?: string; // Made optional for initial Google sign-up
        location?: string; // Made optional for initial Google sign-up
        occupancy?: string; // Made optional for initial Google sign-up
    };
    firebaseUid?: string; // New field for Firebase User ID, optional but unique
    createdAt: Date;
    updatedAt: Date;
}

const profileSchema: Schema<IProfile> = new mongoose.Schema({
    phone: { type: String, unique: true, sparse: true }, // Made optional, unique, and sparse
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    photo: { type: String },
    date: { type: Date, default: Date.now }, // Keep if needed, otherwise remove
    preferences: {
        budget: { type: String }, // Made optional
        location: { type: String }, // Made optional
        occupancy: { type: String } // Made optional
    },
    firebaseUid: { type: String, unique: true, sparse: true } // Add firebaseUid field
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
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

export const Profile = mongoose.model<IProfile>("Profile", profileSchema);