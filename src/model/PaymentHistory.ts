import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Payment History document
export interface IPaymentHistory extends Document {
  tenantName: string;
  propertyId: mongoose.Schema.Types.ObjectId;
  bedId: mongoose.Schema.Types.ObjectId;
  amount: number;
  paymentDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  createdAt: Date;
}

const PaymentHistorySchema: Schema<IPaymentHistory> = new mongoose.Schema({
  tenantName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', // Reference to the Property model
    required: true 
  },
  bedId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bed', // Reference to the Bed model
    required: true 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  paymentDate: { 
    type: Date, 
    default: Date.now 
  },
  status: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending'
  }
}, {
  timestamps: true
});

export const PaymentHistory = mongoose.model<IPaymentHistory>('PaymentHistory', PaymentHistorySchema);