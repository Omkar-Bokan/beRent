// src/model/Property.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for your Property document
export interface IProperty extends Document {
  title: string;
  location: string;
  address: string;
  rentRange: string; 
  minRent: number; // CRITICAL: Must be type number
  maxRent: number; // CRITICAL: Must be type number
  totalBeds: number;
  monthlyRevenue: number;
  contactPerson: string;
  contactPhone: string;
  status: 'active'| 'inactive'| 'maintenance'| 'full'| 'available soon';
  description: string;
  amenities: string[];
  images: string[];
  area?: string;
  type?: any; // Consider more specific types if possible
  rating?: any;
  reviews?: any;
  owner?: string;
  rules?: any;
  nearby?: any;
  available?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema<IProperty> = new mongoose.Schema({
   title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  rentRange: { type: String }, 
  minRent: { type: Number, required: true }, 
  maxRent: { type: Number, required: true }, 
  totalBeds: { type: Number, required: true, min: 1 },
  monthlyRevenue: { type: Number, required: true, min: 0 },
  contactPerson: { type: String, required: true, trim: true },
  contactPhone: { type: String, required: true, trim: true },
  status: { type: String, required: true, enum: ['active', 'inactive', 'maintenance', 'full', 'available soon'], default: 'active' },
  description: { type: String, required: true },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] },
  area: { type: String },
  type: { type: Schema.Types.Mixed },
  rating: { type: Schema.Types.Mixed },
  reviews: { type: Schema.Types.Mixed },
  owner: { type: String },
  rules: { type: Schema.Types.Mixed },
  nearby: { type: Schema.Types.Mixed },
  available: { type: Schema.Types.Mixed }

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
