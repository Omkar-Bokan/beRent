import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for your Lead document
export interface ILead extends Document {
    name: string;
    phone: string;
    email: string;
    location: string;
    budget: number;
    moveInDate: Date;
    priority: 'Low' | 'Medium' | 'High';
    requirements: string;
    source: string;
    status: 'new' | 'contacted' | 'interested' | 'qualified' | 'converted' | 'not_interested';
    createdAt: Date;
    updatedAt: Date;
}

export interface ILead extends Document {
    name: string;
    // ... other properties
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema: Schema<ILead> = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    budget: { type: Number, required: true },
    moveInDate: { type: Date, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    requirements: { type: String, required: true },
    source: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'interested', 'qualified', 'converted', 'not_interested'], default: 'new' }
}, {
    timestamps: true
});

// Explicitly define the 'id' virtual (often not needed as Mongoose does it implicitly)
// LeadSchema.virtual('id').get(function() {
//   return this._id.toHexString();
// });

// Set toJSON options to include virtuals
LeadSchema.set('toJSON', {
    virtuals: true
});

// If you also want to remove __v, you can add a transform here,
// which essentially brings us back to the previous recommended method.
// LeadSchema.set('toJSON', {
//   virtuals: true,
//   transform: (doc, ret) => {
//     ret.id = ret._id.toString(); // Ensure 'id' is always there if _id exists
//     delete ret._id;             // Remove the original _id field
//     delete ret.__v;             // Remove the version key
//     return ret;
//   }
// });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);