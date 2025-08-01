import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Tenant History document
export interface ITenantHistory extends Document {
  tenantName: string;
  action: 'moved-in' | 'moved-out';
  propertyId: mongoose.Schema.Types.ObjectId;
  bedId: mongoose.Schema.Types.ObjectId;
  actionDate: Date;
  createdAt: Date;
}

const TenantHistorySchema: Schema<ITenantHistory> = new mongoose.Schema({
  tenantName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  action: { 
    type: String, 
    enum: ['moved-in', 'moved-out'], 
    required: true 
  },
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
  },
  bedId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bed', 
    required: true 
  },
  actionDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export const TenantHistory = mongoose.model<ITenantHistory>('TenantHistory', TenantHistorySchema);