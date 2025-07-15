import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    rentRange: { type: String, required: true },
    totalBeds: { type: Number, required: true },
    monthlyRevenue: { type: Number, required: true },
    contactPerson: { type: String, required: true },
    contactPhone: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String, required: true },
    amenities: [{ type: String }]
});

const Property = mongoose.model('Property', PropertySchema);
export default Property;
