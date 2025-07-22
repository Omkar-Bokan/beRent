import mongoose from 'mongoose';

// TypeScript interface for tenant details
interface TenantDetails {
    tenantName?: string | null;
    tenantPhone?: string | null;
    tenantEmail?: string | null;
    rentAmount?: number | null;
    securityDeposit?: number | null;
    moveInDate?: Date | null;
    moveOutDate?: Date | null;
}

// Define the schema for tenant details
const tenantDetailsSchema = new mongoose.Schema({
    tenantName: { type: String },
    tenantPhone: { type: String },
    tenantEmail: { type: String },
    rentAmount: { type: Number },
    securityDeposit: { type: Number },
    moveInDate: { type: Date },
    moveOutDate: { type: Date } // Optional: for 'on notice' or after move-out
}, { _id: false }); // Do not create a separate _id for the subdocument

// Define the main Bed schema
const bedSchema = new mongoose.Schema({
    bedNumber: {
        type: String,
        required: [true, 'Bed number is required.'],
        unique: true,
        trim: true // Remove whitespace from both ends of a string
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
        type: tenantDetailsSchema,
        default: {} // Default to an empty object if no tenant details
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Pre-save hook for validation
bedSchema.pre('save', function (next) {
    const requiredTenantFields: (keyof TenantDetails)[] = ['tenantName', 'tenantPhone', 'rentAmount', 'moveInDate'];
    const tenantDetails = this.tenantDetails as TenantDetails;

    if (this.status === 'vacant' || this.status === 'maintenance') {
        // Clear tenant details if status becomes vacant or maintenance
        this.tenantDetails = {};
    } else if (this.status === 'occupied' || this.status === 'on notice') {
        // Validate required tenant details if status is occupied or on notice
        for (const field of requiredTenantFields) {
            if (!tenantDetails || !tenantDetails[field]) {
                return next(new Error(`Tenant ${field} is required for status '${this.status}'.`));
            }
        }
    }
    next();
});

// Pre-findOneAndUpdate hook for 'findByIdAndUpdate' operations
bedSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate(); // Get the update payload
    const query = this.getQuery(); // Get the query used to find the document

    // Fetch the current document to check its status if not explicitly provided in update
    let currentBed;
    try {
        currentBed = await this.model.findOne(query).select('status tenantDetails');
    } catch (error: any) {
        return next(error);
    }

    // Determine the new status from the update payload, or use current status if not updated
    const hasSet = typeof update === 'object' && update !== null && '$set' in update && typeof (update as any).$set === 'object';
    const newStatus = hasSet && (update as any).$set.status ? (update as any).$set.status : (currentBed ? currentBed.status : null);
    const tenantDetails: TenantDetails = hasSet && (update as any).$set.tenantDetails ? (update as any).$set.tenantDetails : (currentBed ? currentBed.tenantDetails : {});
    const requiredTenantFields: (keyof TenantDetails)[] = ['tenantName', 'tenantPhone', 'rentAmount', 'moveInDate'];

    if (newStatus === 'vacant' || newStatus === 'maintenance') {
        // Clear tenant details if status becomes vacant or maintenance
        if (
            typeof update === 'object' &&
            update !== null &&
            '$set' in update &&
            typeof (update as any).$set === 'object'
        ) {
            (update as any).$set.tenantDetails = {};
        } else if (typeof update === 'object' && update !== null) {
            (update as any).tenantDetails = {};
        }
    } else if (newStatus === 'occupied' || newStatus === 'on notice') {
        // Validate required tenant details if status is occupied or on notice
        for (const field of requiredTenantFields) {
            if (!tenantDetails[field]) {
                return next(new Error(`Tenant ${field} is required for status '${newStatus}'.`));
            }
        }
    }
    next();
});


export const Bed = mongoose.model('Bed', bedSchema);