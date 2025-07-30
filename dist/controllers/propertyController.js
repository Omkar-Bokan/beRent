"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updatePropertyStatus = exports.updateProperty = exports.getPropertyById = exports.getProperties = exports.createProperty = exports.uploadUpdate = exports.upload = void 0;
const Property_1 = require("../model/Property"); // Assuming IProperty is defined in Property.ts
const beds_1 = require("../model/beds"); // Import the Bed model
// import { Payment } from '../model/payments'; // Uncomment if you have a Payment model and want to cascade payments
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// --- Multer Configuration ---
const uploadsDir = path_1.default.join(__dirname, '../../uploads'); // Adjust path as needed
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true }); // Ensure directory exists, create recursively if needed
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Images will be saved in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Generate a unique filename: fieldname-timestamp.ext
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    }
});
// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        // You might want to provide an error message here if an invalid file type is uploaded.
        // For example: cb(new Error('Only image files are allowed!'), false);
        // However, Multer's error handling for fileFilter errors needs careful implementation in routes.
        // For simplicity, we'll just ignore non-image files for now, or rely on frontend validation.
        cb(null, false); // Reject the file silently
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    }
}).array('images', 3); // 'images' is the field name for the array of files, max 3
exports.uploadUpdate = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    }
}).array('newImages', 3); // 'newImages' is the field name for newly uploaded images during update, max 3
// --- Property Controllers ---
// Create a new property and its associated beds
const createProperty = async (req, res) => {
    console.log("Inside createProperty Controller");
    console.log("REQ BODY:", req.body);
    const uploadedFiles = req?.files;
    console.log("Uploaded Files:", uploadedFiles);
    try {
        const { title, location, address, rentRange, totalBeds, // This will be used to create beds
        monthlyRevenue, contactPerson, contactPhone, status, description, amenities } = req.body;
        // Basic validation for required fields
        if (!title || !location || !address || !rentRange || !totalBeds || !monthlyRevenue || !contactPerson || !contactPhone || !status || !description) {
            // If validation fails, delete any uploaded files
            uploadedFiles.forEach(file => {
                fs_1.default.unlink(file.path, (err) => {
                    if (err)
                        console.error("Error deleting file after validation error:", err);
                });
            });
            return res.status(400).json({ message: "All required fields are missing. Please provide title, location, address, rentRange, totalBeds, monthlyRevenue, contactPerson, contactPhone, status, and description." });
        }
        // Validate totalBeds as a positive number
        const parsedTotalBeds = parseInt(totalBeds, 10); // Use radix 10 for parseInt
        if (isNaN(parsedTotalBeds) || parsedTotalBeds <= 0) {
            uploadedFiles.forEach(file => {
                fs_1.default.unlink(file.path, (err) => {
                    if (err)
                        console.error("Error deleting file after validation error (totalBeds):", err);
                });
            });
            return res.status(400).json({ message: "Total Beds must be a positive number." });
        }
        // Get image paths for storing in the database
        const imagePaths = uploadedFiles.map(file => `/uploads/${file.filename}`);
        // Create the new Property document
        const newProperty = new Property_1.Property({
            title,
            location,
            address,
            rentRange,
            totalBeds: parsedTotalBeds, // Store the parsed number
            monthlyRevenue,
            contactPerson,
            contactPhone,
            status,
            description,
            amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
            images: imagePaths
        });
        // Save the property to get its _id
        await newProperty.save();
        console.log("New property saved with ID:", newProperty.id);
        // --- Create Beds associated with this new property ---
        const bedsToCreate = [];
        for (let i = 1; i <= parsedTotalBeds; i++) {
            bedsToCreate.push({
                propertyId: newProperty._id,
                bedNumber: `Bed ${i}`, // Example naming convention
                status: 'vacant', // Initial status
                tenantDetails: {} // Empty tenant details initially
            });
        }
        await beds_1.Bed.insertMany(bedsToCreate); // Efficiently insert all beds
        res.status(201).json({
            success: true,
            message: "Property created successfully, and beds initialized.",
            data: newProperty // Optionally, you could also return the created beds here
        });
    }
    catch (error) {
        console.error("Error creating property:", error);
        // If an error occurs during save (e.g., DB error, validation), delete uploaded files
        uploadedFiles.forEach(file => {
            fs_1.default.unlink(file.path, (err) => {
                if (err)
                    console.error("Error deleting file after DB error:", err);
            });
        });
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error: Could not create property.",
            error: error.message
        });
    }
};
exports.createProperty = createProperty;
// Get all properties
const getProperties = async (req, res) => {
    try {
        const properties = await Property_1.Property.find({});
        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    }
    catch (error) {
        console.error("Error fetching all properties:", error);
        res.status(500).json({
            success: false,
            message: "Server error: Could not retrieve properties.",
            error: error.message
        });
    }
};
exports.getProperties = getProperties;
// Get a single property by ID
const getPropertyById = async (req, res) => {
    try {
        const property = await Property_1.Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }
        res.status(200).json({
            success: true,
            data: property
        });
    }
    catch (error) {
        console.error("Error fetching property by ID:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error: Could not retrieve property.",
            error: error.message
        });
    }
};
exports.getPropertyById = getPropertyById;
// Update an existing property by ID
const updateProperty = async (req, res) => {
    const newUploadedFiles = req.files;
    console.log("New Uploaded Files for Update:", newUploadedFiles);
    console.log("REQ BODY (Update):", req.body);
    try {
        const { id } = req.params;
        const { title, location, address, rentRange, totalBeds, monthlyRevenue, contactPerson, contactPhone, status, description, amenities, existingImages // This will be an array of image URLs to keep from the frontend
         } = req.body;
        const property = await Property_1.Property.findById(id);
        if (!property) {
            // Clean up newly uploaded files if property not found
            newUploadedFiles.forEach(file => {
                fs_1.default.unlink(file.path, (err) => {
                    if (err)
                        console.error("Error deleting new file after property not found:", err);
                });
            });
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }
        // Prepare the updated data. Ensure numbers are parsed correctly.
        const updatedData = {
            title,
            location,
            address,
            rentRange,
            totalBeds: parseInt(totalBeds, 10) || 0,
            monthlyRevenue: parseInt(monthlyRevenue, 10) || 0,
            contactPerson,
            contactPhone,
            status,
            description,
            amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
        };
        // Handle images: Combine existing images (that were not removed) and new uploads
        let finalImages = [];
        // Add existing images that were explicitly sent back from frontend
        if (existingImages) {
            // Ensure existingImages is treated as an array, even if it's a single string
            finalImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        }
        // Add new uploaded images
        const newImagePaths = newUploadedFiles.map(file => `/uploads/${file.filename}`);
        finalImages = [...finalImages, ...newImagePaths];
        // Validate total images count before proceeding
        if (finalImages.length > 3) {
            newUploadedFiles.forEach(file => {
                fs_1.default.unlink(file.path, (err) => {
                    if (err)
                        console.error("Error deleting new file due to image count limit:", err);
                });
            });
            return res.status(400).json({ success: false, message: "Maximum 3 images allowed in total." });
        }
        // Identify images to delete (those present in DB but not in finalImages received from frontend)
        const imagesToDelete = property.images?.filter(imgUrl => !finalImages.includes(imgUrl)) || [];
        // Delete old physical files that are no longer part of the property
        imagesToDelete.forEach(imgUrl => {
            const filename = path_1.default.basename(imgUrl); // Get just the filename from the URL
            const filePath = path_1.default.join(uploadsDir, filename);
            fs_1.default.unlink(filePath, (err) => {
                if (err)
                    console.error(`Error deleting old image file ${filePath}:`, err);
            });
        });
        updatedData.images = finalImages; // Update the images array in the document
        // Update the property in the database
        const updatedProperty = await Property_1.Property.findByIdAndUpdate(id, updatedData, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        });
        if (!updatedProperty) {
            return res.status(404).json({
                success: false,
                message: "Property not found after update attempt." // Should ideally not happen if found initially
            });
        }
        res.status(200).json({
            success: true,
            message: "Property updated successfully.",
            data: updatedProperty
        });
    }
    catch (error) {
        console.error("Error updating property:", error);
        // If an error occurs, delete any newly uploaded files
        newUploadedFiles.forEach(file => {
            fs_1.default.unlink(file.path, (err) => {
                if (err)
                    console.error("Error deleting new file after update DB error:", err);
            });
        });
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error: Could not update property.",
            error: error.message
        });
    }
};
exports.updateProperty = updateProperty;
// Update only the status of a property by ID
const updatePropertyStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status field is required for status update."
            });
        }
        const allowedStatuses = ['active', 'Inactive', 'Maintenance', 'Full', 'available soon'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status value. Allowed values are: ${allowedStatuses.join(', ')}.`
            });
        }
        const property = await Property_1.Property.findByIdAndUpdate(req.params.id, { status: status }, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators
        });
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Property status updated successfully.",
            data: property
        });
    }
    catch (error) {
        console.error("Error updating property status:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error: Could not update property status.",
            error: error.message
        });
    }
};
exports.updatePropertyStatus = updatePropertyStatus;
// Delete a property by ID and associated beds/payments
const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the property first to get image paths for deletion
        const property = await Property_1.Property.findById(id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }
        // --- NEW: Implement Cascading Deletion for associated records ---
        // Delete all beds associated with this property
        await beds_1.Bed.deleteMany({ propertyId: id });
        // Uncomment the line below if you have a Payment model and want to delete associated payments
        // await Payment.deleteMany({ propertyId: id });
        // --- END CASCADING DELETION ---
        // Now delete the property itself
        await Property_1.Property.findByIdAndDelete(id);
        // Delete associated image files from the file system
        property.images?.forEach(imgUrl => {
            const filename = path_1.default.basename(imgUrl);
            const filePath = path_1.default.join(uploadsDir, filename);
            fs_1.default.unlink(filePath, (err) => {
                if (err)
                    console.error(`Error deleting image file ${filePath}:`, err);
            });
        });
        res.status(200).json({
            success: true,
            message: "Property and its associated beds (and payments) deleted successfully.",
            // It's common to return the deleted item's ID or a confirmation, not the full deleted object.
            data: { id: id }
        });
    }
    catch (error) {
        console.error("Error deleting property:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error: Could not delete property.",
            error: error.message
        });
    }
};
exports.deleteProperty = deleteProperty;
