import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
    id: string;
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

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);