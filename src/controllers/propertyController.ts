import { Request, Response } from 'express';
import { Property, IProperty } from '../model/Property';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../../uploads'); // Adjust path as needed
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, uploadsDir); // Images will be saved in the 'uploads' directory
    },
    filename: (req: any, file: any, cb: any) => {
        // Generate a unique filename: fieldname-timestamp.ext
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter to accept only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // cb(new Error('Only image files are allowed!'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    }
}).array('images', 3);
export const uploadUpdate = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    }
}).array('newImages', 3);

export const createProperty = async (req: Request, res: Response) => {
    console.log("Inside createProperty Controller");
    console.log("REQ BODY:", req.body);
    // req.files will contain the array of uploaded image files
    const uploadedFiles = req?.files as Express.Multer.File[];
    console.log("Uploaded Files:", uploadedFiles);

    try {
        const {
            title,
            location,
            address,
            rentRange,
            totalBeds,
            monthlyRevenue,
            contactPerson,
            contactPhone,
            status,
            description,
            amenities
        } = req.body;

        // Basic validation for required fields
        if (!title || !location || !address || !rentRange || !totalBeds || !monthlyRevenue || !contactPerson || !contactPhone || !status || !description) {
            // If validation fails, delete any uploaded files
            uploadedFiles.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error("Error deleting file after validation error:", err);
                });
            });
            return res.status(400).json({ message: "All required fields are missing. Please provide title, location, address, rentRange, totalBeds, monthlyRevenue, contactPerson, contactPhone, status, and description." });
        }

        // Get image paths for storing in the database
        const imagePaths = uploadedFiles.map(file => `/uploads/${file.filename}`);

        const newProperty = new Property({
            title,
            location,
            address,
            rentRange,
            totalBeds,
            monthlyRevenue,
            contactPerson,
            contactPhone,
            status,
            description,
            amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
            images: imagePaths
        });

        await newProperty.save();
        res.status(201).json({
            success: true,
            message: "Property created successfully.",
            data: newProperty
        });

    } catch (error: any) {
        console.error("Error creating property:", error);
        // If an error occurs during save, delete uploaded files
        uploadedFiles.forEach(file => {
            fs.unlink(file.path, (err) => {
                if (err) console.error("Error deleting file after DB error:", err);
            });
        });

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
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

// Get all properties
export const getProperties = async (req: Request, res: Response) => {
    try {
        const properties = await Property.find({});
        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error: any) {
        console.error("Error fetching all properties:", error);
        res.status(500).json({
            success: false,
            message: "Server error: Could not retrieve properties.",
            error: error.message
        });
    }
};

// Get a single property by ID
export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const property = await Property.findById(req.params.id);

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
    } catch (error: any) {
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

// Update an existing property by ID
export const updateProperty = async (req: Request, res: Response) => {
    // req.files will contain the array of newly uploaded image files (using 'newImages' field name)
    const newUploadedFiles = req.files as Express.Multer.File[];
    console.log("New Uploaded Files for Update:", newUploadedFiles);
    console.log("REQ BODY (Update):", req.body);

    try {
        const { id } = req.params;
        const {
            title,
            location,
            address,
            rentRange,
            totalBeds,
            monthlyRevenue,
            contactPerson,
            contactPhone,
            status,
            description,
            amenities,
            existingImages // This will be an array of image URLs to keep
        } = req.body;

        const property = await Property.findById(id);

        if (!property) {
            newUploadedFiles.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error("Error deleting new file after property not found:", err);
                });
            });
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }

        // Prepare the updated data
        const updatedData: Partial<IProperty> = {
            title,
            location,
            address,
            rentRange,
            totalBeds: parseInt(totalBeds) || 0, // Ensure numbers are parsed
            monthlyRevenue: parseInt(monthlyRevenue) || 0,
            contactPerson,
            contactPhone,
            status,
            description,
            amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
        };

        // Handle images: Combine existing images (that were not removed) and new uploads
        let finalImages: string[] = [];

        // Add existing images that were explicitly sent back from frontend
        if (existingImages) {
            finalImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        }

        // Add new uploaded images
        const newImagePaths = newUploadedFiles.map(file => `/uploads/${file.filename}`);
        finalImages = [...finalImages, ...newImagePaths];

        // Validate total images count (optional, but good practice if you enforce on backend too)
        if (finalImages.length > 3) {
            newUploadedFiles.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error("Error deleting new file due to image count limit:", err);
                });
            });
            return res.status(400).json({ success: false, message: "Maximum 3 images allowed." });
        }

        // Identify images to delete (those present in DB but not in finalImages)
        const imagesToDelete = property.images?.filter(imgUrl => !finalImages.includes(imgUrl)) || [];

        // Delete old physical files
        imagesToDelete.forEach(imgUrl => {
            const filename = path.basename(imgUrl); // Get just the filename
            const filePath = path.join(uploadsDir, filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting old image file ${filePath}:`, err);
            });
        });

        updatedData.images = finalImages; // Update the images array in the document

        // Update the property in the database
        const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: "Property updated successfully.",
            data: updatedProperty
        });
    } catch (error: any) {
        console.error("Error updating property:", error);
        // If an error occurs, delete any newly uploaded files
        newUploadedFiles.forEach(file => {
            fs.unlink(file.path, (err) => {
                if (err) console.error("Error deleting new file after update DB error:", err);
            });
        });

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
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

// Update only the status of a property by ID
export const updatePropertyStatus = async (req: Request, res: Response) => {
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

        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { status: status },
            {
                new: true,
                runValidators: true
            }
        );

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
    } catch (error: any) {
        console.error("Error updating property status:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
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

// Delete a property by ID
export const deleteProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const property = await Property.findByIdAndDelete(id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }

        // Delete associated image files
        property.images?.forEach(imgUrl => {
            const filename = path.basename(imgUrl);
            const filePath = path.join(uploadsDir, filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting image file ${filePath}:`, err);
            });
        });

        res.status(200).json({
            success: true,
            message: "Property deleted successfully.",
            data: property
        });
    } catch (error: any) {
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