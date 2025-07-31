"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bed = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for tenant details
const tenantDetailsSchema = new mongoose_1.default.Schema({
    tenantName: { type: String, trim: true }, //required: true,
    tenantPhone: { type: String, trim: true },
    tenantEmail: { type: String, trim: true, lowercase: true, match: [/.+@.+\..+/, 'Please fill a valid email address'] },
    rentAmount: { type: Number, min: 0 },
    securityDeposit: { type: Number, default: 0, min: 0 },
    moveInDate: { type: Date, default: Date.now }
}, { _id: false });
// Define the main Bed schema
const bedSchema = new mongoose_1.default.Schema({
    bedNumber: {
        type: String,
        required: [true, 'Bed number is required.'],
        unique: true,
        trim: true
    },
    propertyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Property', // Reference to the Property model
        required: [true, 'Property ID is required.']
    },
    roomNumber: {
        type: String,
        // re\quired: [true, 'Room number is required.'],
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
    tenantDetails: tenantDetailsSchema,
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            const transformedRet = ret;
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
            const transformedRet = ret;
            if (transformedRet._id) {
                transformedRet.id = transformedRet._id.toString();
            }
            delete transformedRet._id;
            delete transformedRet.__v;
            return transformedRet;
        }
    }
});
// Pre-save hook for validation
bedSchema.pre('save', function (next) {
    const requiredTenantFields = ['tenantName', 'tenantPhone', 'rentAmount', 'moveInDate'];
    const tenantDetails = this.tenantDetails; // Directly use this.tenantDetails
    if (this.status === 'vacant' || this.status === 'maintenance') {
        // Clear tenant details if status becomes vacant or maintenance
        this.tenantDetails = undefined; // Set to undefined to remove it completely or {} to empty
    }
    else if (this.status === 'occupied' || this.status === 'on notice') {
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
    const updateSet = ('$set' in update && typeof update.$set === 'object') ? update.$set : update;
    // Fetch the current document if necessary
    let currentBed;
    try {
        currentBed = await this.model.findOne(query).select('status tenantDetails');
    }
    catch (error) {
        return next(error);
    }
    const newStatus = updateSet.status !== undefined ? updateSet.status : (currentBed ? currentBed.status : undefined);
    const newTenantDetails = updateSet.tenantDetails !== undefined ? updateSet.tenantDetails : (currentBed ? currentBed.tenantDetails : {});
    const requiredTenantFields = ['tenantName', 'tenantPhone', 'rentAmount', 'moveInDate'];
    if (newStatus === 'vacant' || newStatus === 'maintenance') {
        // Clear tenant details if status becomes vacant or maintenance
        // Set tenantDetails to an empty object or undefined in the update payload
        updateSet.tenantDetails = {}; // Explicitly clear in update operation
    }
    else if (newStatus === 'occupied' || newStatus === 'on notice') {
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
exports.Bed = mongoose_1.default.model('Bed', bedSchema);
