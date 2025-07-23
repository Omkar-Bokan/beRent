"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LeadSchema = new mongoose_1.Schema({
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
exports.Lead = mongoose_1.default.model('Lead', LeadSchema);
