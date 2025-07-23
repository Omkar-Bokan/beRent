import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for your Payment document
export interface IPayment extends Document {
    bedId: mongoose.Types.ObjectId;
    propertyId: mongoose.Types.ObjectId;
    tenantName: string;
    amount: number;
    paymentDate: Date;
    status: 'paid' | 'pending' | 'overdue';
    createdAt: Date;
    updatedAt: Date;
    // Add other fields here if you uncomment them in the schema
    // paymentMethod?: string;
    // transactionId?: string;
    // notes?: string;
}

const paymentSchema: Schema<IPayment> = new mongoose.Schema({ // Add interface to schema
    bedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bed',
        required: [true, 'Bed ID is required for payment.']
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: [true, 'Property ID is required for payment.']
    },
    tenantName: {
        type: String,
        required: [true, 'Tenant name is required.']
    },
    amount: {
        type: Number,
        required: [true, 'Payment amount is required.'],
        min: [0, 'Amount cannot be negative.']
    },
    paymentDate: {
        type: Date,
        default: Date.now,
        required: [true, 'Payment date is required.']
    },
    status: {
        type: String,
        enum: {
            values: ['paid', 'pending', 'overdue'],
            message: 'Status must be one of: paid, pending, overdue.'
        },
        default: 'pending',
        required: [true, 'Payment status is required.']
    },
    // You can add more fields like:
    // paymentMethod: { type: String },
    // transactionId: { type: String },
    // notes: { type: String }
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

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);