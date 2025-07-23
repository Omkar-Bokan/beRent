import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for your Property document
export interface IProperty extends Document {
    title: string;
    location: string;
    address: string;
    rentRange: string;
    totalBeds: number;
    monthlyRevenue: number;
    contactPerson: string;
    contactPhone: string;
    status: 'active' | 'Inactive' | 'Maintenance' | 'Full' | 'available soon';
    description: string;
    amenities: string[]; // Array of strings
    createdAt: Date;
    updatedAt: Date;
}

const PropertySchema: Schema<IProperty> = new mongoose.Schema({ // Add interface to schema
    title: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    rentRange: { type: String, required: true },
    totalBeds: { type: Number, required: true },
    monthlyRevenue: { type: Number, required: true },
    contactPerson: { type: String, required: true },
    contactPhone: { type: String, required: true },
    status: { type: String, required: true, enum: ['active', 'Inactive', 'Maintenance', 'Full', 'available soon'] },
    description: { type: String, required: true },
    amenities: [{ type: String }] // Defines an array of strings
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

export const Property = mongoose.model<IProperty>('Property', PropertySchema);
// It's generally better to use named exports for models
// export default Property; // You can keep this if you prefer default exports, but named is common with interfaces