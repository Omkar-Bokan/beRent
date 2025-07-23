import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for your Profile document
export interface IProfile extends Document {
    phone: number; // Consider changing to string if it includes country codes/non-numeric chars
    name: string;
    email: string;
    role: string;
    photo?: string; // Made optional as it has no required: true
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const profileSchema: Schema<IProfile> = new mongoose.Schema({ // Add interface to schema
    phone: { type: Number, required: true, unique: true }, // Consider String for phone numbers
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    photo: { type: String },
    date: { type: Date, default: Date.now }
}, {
    timestamps: true, // Assuming you want timestamps for user profiles too
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