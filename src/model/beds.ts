import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for tenant details
export interface ITenantDetails { // Exported for broader use if needed
    tenantName?: string | null;
    tenantPhone?: string | null;
    tenantEmail?: string | null;
    rentAmount?: number | null;
    securityDeposit?: number | null;
    moveInDate?: Date | null;
    moveOutDate?: Date | null; // Optional: for 'on notice' or after move-out
}

// Define the schema for tenant details
const tenantDetailsSchema = new mongoose.Schema<ITenantDetails>({ // Add interface to schema
    tenantName: { type: String },
    tenantPhone: { type: String },
    tenantEmail: { type: String },
    rentAmount: { type: Number },
    securityDeposit: { type: Number },
    moveInDate: { type: Date },
    moveOutDate: { type: Date }
}, { _id: false }); // _id: false means this subdocument won't have its own _id

// Define the main Bed interface
export interface IBed extends Document {
    bedNumber: string;
    propertyId: mongoose.Types.ObjectId; // Use mongoose.Types.ObjectId for ref
    roomNumber: string;
    status: 'vacant' | 'occupied' | 'maintenance' | 'on notice';
    tenantDetails?: ITenantDetails; // Optional, as it can be cleared
    createdAt: Date;
    updatedAt: Date;
}

// Define the main Bed schema
const bedSchema = new mongoose.Schema<IBed>({ // Add interface to schema
    bedNumber: {
        type: String,
        required: [true, 'Bed number is required.'],
        unique: true,
        trim: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property', // Reference to the Property model
        required: [true, 'Property ID is required.']
    },
    roomNumber: {
        type: String,
        required: [true, 'Room number is required.'],
        trim: true
    },
    status: {
        type: String,
        enum: {
            values: ['vacant', 'occupied', 'maintenance', 'on notice'],
            message: 'Status must be one of: vacant, occupied, maintenance, on notice.'
        },
        default: 'vacant',
        required: [true, 'Bed status is required.']
    },
    tenantDetails: {
        type: tenantDetailsSchema, // Use the sub-schema here
        default: {} // Default to an empty object if no tenant details
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
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

// Pre-save hook for validation
bedSchema.pre('save', function (next) {
    const requiredTenantFields: (keyof ITenantDetails)[] = ['tenantName', 'tenantPhone', 'rentAmount', 'moveInDate'];
    const tenantDetails = this.tenantDetails; // Directly use this.tenantDetails

    if (this.status === 'vacant' || this.status === 'maintenance') {
        // Clear tenant details if status becomes vacant or maintenance
        this.tenantDetails = undefined; // Set to undefined to remove it completely or {} to empty
    } else if (this.status === 'occupied' || this.status === 'on notice') {
        // Validate required tenant details if status is occupied or on notice
        for (const field of requiredTenantFields) {
            // Check if tenantDetails exists and if the field is missing or empty string/null
            if (!tenantDetails || tenantDetails[field] === null || tenantDetails[field] === undefined || (typeof tenantDetails[field] === 'string' && tenantDetails[field].trim() === '')) {
                return next(new Error(`Tenant ${field} is required for status '${this.status}'.`));
            }
        }
    }
    next();
});

// Pre-findOneAndUpdate hook for 'findByIdAndUpdate' operations
bedSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    const query = this.getQuery();

    // Ensure update is an object before proceeding
    if (typeof update !== 'object' || update === null) {
        return next();
    }

    // Use $set to safely access update fields
    const updateSet: any = ('$set' in update && typeof (update as any).$set === 'object') ? (update as any).$set : update;

    // Fetch the current document if necessary
    let currentBed;
    try {
        currentBed = await this.model.findOne(query).select('status tenantDetails');
    } catch (error: any) {
        return next(error);
    }

    const newStatus = updateSet.status !== undefined ? updateSet.status : (currentBed ? currentBed.status : undefined);
    const newTenantDetails = updateSet.tenantDetails !== undefined ? updateSet.tenantDetails : (currentBed ? currentBed.tenantDetails : {});

    const requiredTenantFields: (keyof ITenantDetails)[] = ['tenantName', 'tenantPhone', 'rentAmount', 'moveInDate'];

    if (newStatus === 'vacant' || newStatus === 'maintenance') {
        // Clear tenant details if status becomes vacant or maintenance
        // Set tenantDetails to an empty object or undefined in the update payload
        updateSet.tenantDetails = {}; // Explicitly clear in update operation
    } else if (newStatus === 'occupied' || newStatus === 'on notice') {
        // Validate required tenant details if status is occupied or on notice
        for (const field of requiredTenantFields) {
            if (!newTenantDetails || newTenantDetails[field] === null || newTenantDetails[field] === undefined || (typeof newTenantDetails[field] === 'string' && newTenantDetails[field].trim() === '')) {
                return next(new Error(`Tenant ${field} is required for status '${newStatus}'.`));
            }
        }
    }

    // If update was not using $set, ensure the modified fields are correctly applied
    if (!('$set' in update)) {
        this.setUpdate(updateSet); // Re-set the update if modifications were made directly to `update`
    }

    next();
});


export const Bed = mongoose.model<IBed>('Bed', bedSchema);