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
    // *** Add toJSON/toObject options for _id to id transformation ***
    toJSON: {
        virtuals: true,
        // transform: (doc, ret) => {
        //     ret.id = ret._id.toString();
        //     delete ret._id;
        //     delete ret.__v;
        //     return ret;
        // }
    },
    // toObject: {
    //     virtuals: true,
    //     transform: (doc, ret) => {
    //         ret.id = ret._id.toString();
    //         delete ret._id;
    //         delete ret.__v;
    //         return ret;
    //     }
    // }
});

export const Property = mongoose.model<IProperty>('Property', PropertySchema);
// It's generally better to use named exports for models
// export default Property; // You can keep this if you prefer default exports, but named is common with interfaces