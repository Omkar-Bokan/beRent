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

export const PaymentHistory = mongoose.model<IPaymentHistory>('PaymentHistory', PaymentHistorySchema);