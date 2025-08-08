// import { Request, Response } from 'express';
// import { Property, IProperty } from '../model/Property'; 
// import { Bed } from '../model/beds'; 
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import ImageKit from "imagekit";
// import dotenv from "dotenv";
// import { UploadResponse } from "imagekit/dist/libs/interfaces";
// dotenv.config();

// const uploadsDir = path.join(__dirname, '../../uploads'); 
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req: any, file: any, cb: any) => {
//         cb(null, uploadsDir); // Images will be saved in the 'uploads' directory
//     },
//     filename: (req: any, file: any, cb: any) => {
//         // Generate a unique filename: fieldname-timestamp.ext
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     }
// });



// // File filter to accept only images
// const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(null, false); // Reject the file silently
//     }
// };

// export const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // 5MB file size limit
//     }
// }).array('images', 3); // 'images' is the field name for the array of files, max 3

// export const uploadUpdate = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // 5MB file size limit
//     }
// }).array('newImages', 3); 

// // Helper function to parse frontend price range string into min/max numbers
// const parseRentRangeString = (rentRangeString: string) => {
//     let min: number = 0;
//     let max: number = Infinity; // Use Infinity for "Above X"

//     if (!rentRangeString || typeof rentRangeString !== 'string') {
//         console.warn("parseRentRangeString received invalid input:", rentRangeString);
//         return { minRent: null, maxRent: null }; // Explicitly return null for invalid input
//     }

//     // Remove common currency symbols (₹, $) and commas before parsing
//     const cleanString = rentRangeString.replace(/[₹$,\s]/g, '');

//     if (cleanString.includes('-')) {
//         // Example: "8000-12000"
//         const parts = cleanString.split('-');
//         min = parseInt(parts[0], 10);
//         max = parseInt(parts[1], 10);
//     } else if (cleanString.toLowerCase().includes('under')) {
//         // Example: "Under8000"
//         const value = parseInt(cleanString.toLowerCase().replace('under', ''), 10);
//         min = 0; // Default min for "under"
//         max = value;
//     } else if (cleanString.toLowerCase().includes('above')) {
//         // Example: "Above16000"
//         const value = parseInt(cleanString.toLowerCase().replace('above', ''), 10);
//         min = value;
//         max = Infinity; // max remains Infinity
//     } else {
//         // Assume it's a single numerical value string, e.g., "10000"
//         const singleValue = parseInt(cleanString, 10);
//         min = singleValue;
//         max = singleValue;
//     }

//     // Ensure values are numbers; if parsing failed, default to sensible values or null
//     if (isNaN(min)) min = 0; // Default to 0 if min parse fails
//     if (isNaN(max)) max = Infinity; // Default to Infinity if max parse fails

//     console.log(`Parsed "${rentRangeString}" -> minRent: ${min}, maxRent: ${max}`);
//     return { minRent: min, maxRent: max };
// };

// export const createProperty = async (req: Request, res: Response) => {
//     console.log("Inside createProperty Controller");
//     console.log("REQ BODY:", req.body);
//     const uploadedFiles = req?.files as Express.Multer.File[];
//     console.log("Uploaded Files:", uploadedFiles);

//     try {
//         const {
//             title,
//             location,
//             address,
//             rentRange: rentRangeString, // Renamed from original rentRange for clarity
//             totalBeds, 
//             monthlyRevenue,
//             contactPerson,
//             contactPhone,
//             status,
//             description,
//             amenities
//         } = req.body;

//         // Parse rentRange string into minRent and maxRent numbers
//         const { minRent, maxRent } = parseRentRangeString(rentRangeString);

//         // Basic validation for required fields
//         if (!title || !location || !address || minRent === null || maxRent === null || !totalBeds || !monthlyRevenue || !contactPerson || !contactPhone || !status || !description) {
//             // If validation fails, delete any uploaded files
//             uploadedFiles.forEach(file => {
//                 fs.unlink(file.path, (err) => {
//                     if (err) console.error("Error deleting file after validation error:", err);
//                 });
//             });
//             return res.status(400).json({ message: "All required fields are missing or rent range format is invalid. Please provide title, location, address, rent range, totalBeds, monthlyRevenue, contactPerson, contactPhone, status, and description." });
//         }

//         // Validate totalBeds as a positive number
//         const parsedTotalBeds = parseInt(totalBeds as string, 10); // Use radix 10 for parseInt
//         if (isNaN(parsedTotalBeds) || parsedTotalBeds <= 0) {
//             uploadedFiles.forEach(file => {
//                 fs.unlink(file.path, (err) => {
//                     if (err) console.error("Error deleting file after validation error (totalBeds):", err);
//                 });
//             });
//             return res.status(400).json({ message: "Total Beds must be a positive number." });
//         }

//         // Get image paths for storing in the database
//         const imagePaths = uploadedFiles.map(file => `/uploads/${file.filename}`);

//         // Create the new Property document
//         const newProperty = new Property({
//             title,
//             location,
//             address,
//             rentRange: rentRangeString,
//             minRent,
//             maxRent,
//             totalBeds: parsedTotalBeds, 
//             monthlyRevenue,
//             contactPerson,
//             contactPhone,
//             status,
//             description,
//             amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
//             images: imagePaths
//         });

//         // Save the property to get its _id
//         await newProperty.save();
//  console.log("New property saved with ID:", newProperty.id);
//         // --- Create Beds associated with this new property ---
//         const bedsToCreate = [];
//         for (let i = 1; i <= parsedTotalBeds; i++) {
//             bedsToCreate.push({
//                 propertyId: newProperty.id,
//                 bedNumber: `${newProperty.id}-Bed ${i}`, // Example naming convention
//                 status: 'vacant',       // Initial status
//                 tenantDetails: {}       // Empty tenant details initially
//             });
//         }
//         await Bed.insertMany(bedsToCreate); // Efficiently insert all beds

//         res.status(201).json({
//             success: true,
//             message: "Property created successfully, and beds initialized.",
//             data: newProperty // Optionally, you could also return the created beds here
//         });

//     } catch (error: any) {
//         console.error("Error creating property:", error);
//         // If an error occurs during save (e.g., DB error, validation), delete uploaded files
//         uploadedFiles.forEach(file => {
//             fs.unlink(file.path, (err) => {
//                 if (err) console.error("Error deleting file after DB error:", err);
//             });
//         });

//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map((val: any) => val.message);
//             return res.status(400).json({
//                 success: false,
//                 error: messages
//             });
//         }
//         res.status(500).json({
//             success: false,
//             message: "Server error: Could not create property.",
//             error: error.message
//         });
//     }
// };

// // Get all properties with filtering and sorting
// export const getProperties = async (req: Request, res: Response) => {
//     try {
//         const { search, area, price: priceFilterString, occupancy, sortBy, requirement } = req.query;

//         // Initialize an array of conditions for Mongoose $and operator
//         let conditions: any[] = [];
//         let sort: any = {};

//         // 1. Search Term (Full-text search across multiple fields)
//         if (search && typeof search === 'string') {
//             conditions.push({
//                 $or: [
//                     { title: { $regex: search, $options: 'i' } },
//                     { location: { $regex: search, $options: 'i' } },
//                     { address: { $regex: search, $options: 'i' } },
//                     { description: { $regex: search, $options: 'i' } }
//                 ]
//             });
//         }

//         // 2. Area Filter (Location)
//         if (area && typeof area === 'string') {
//             conditions.push({ location: { $regex: area, $options: 'i' } });
//         }

//         // 3. Price Filter (using minRent/maxRent fields from DB)
//         if (priceFilterString && typeof priceFilterString === 'string') {
//             const { minRent: filterMinPrice, maxRent: filterMaxPrice } = parseRentRangeString(priceFilterString);

//             if (filterMinPrice !== null && filterMaxPrice !== null) {
//                 // Corrected: Push price conditions into the conditions array
//                 conditions.push(
//                     { maxRent: { $gte: filterMinPrice } },
//                     { minRent: { $lte: filterMaxPrice } }
//                 );
//             } else {
//                 console.warn("Skipping price filter due to invalid parsed range for:", priceFilterString);
//             }
//         }

//         // 4. Occupancy Filter (totalBeds)
//         if (occupancy && typeof occupancy === 'string') {
//             let bedsCount: number | undefined;
//             switch (occupancy.toLowerCase()) {
//                 case 'single': bedsCount = 1; break;
//                 case 'double': bedsCount = 2; break;
//                 case 'triple': bedsCount = 3; break;
//                 case 'quad': bedsCount = 4; break;
//                 // Add more cases if needed
//             }
//             if (bedsCount !== undefined) {
//                 conditions.push({ totalBeds: bedsCount });
//             }
//         }

//         // 5. Quick Requirement
//         if (requirement && typeof requirement === 'string') {
//             conditions.push({
//                 $or: [
//                     { description: { $regex: requirement, $options: 'i' } },
//                     { title: { $regex: requirement, $options: 'i' } }
//                 ]
//             });
//         }
        
//         // Construct the final query object
//         let query: any = {};
//         if (conditions.length > 0) {
//             query.$and = conditions;
//         }

//         // 6. Sorting
//         if (sortBy && typeof sortBy === 'string') {
//             if (sortBy === 'price-low') {
//                 sort.minRent = 1; // Sort by the minimum rent in ascending order
//             } else if (sortBy === 'price-high') {
//                 sort.minRent = -1; // Sort by the minimum rent in descending order
//             }
//         }
        
//         console.log("Final MongoDB Query:", JSON.stringify(query));
//         console.log("Final MongoDB Sort:", JSON.stringify(sort));

//         const properties = await Property.find(query).sort(sort);

//         res.status(200).json({
//             success: true,
//             count: properties.length,
//             data: properties
//         });
//     } catch (error: any) {
//         console.error("Error fetching properties with filters:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server error: Could not retrieve properties with filters.",
//             error: error.message
//         });
//     }
// };

// // Get a single property by ID
// export const getPropertyById = async (req: Request, res: Response) => {
//     try {
//         const property = await Property.findById(req.params.id);

//         if (!property) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Property not found."
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: property
//         });
//     } catch (error: any) {
//         console.error("Error fetching property by ID:", error);
//         if (error.name === 'CastError') {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Property ID format."
//             });
//         }
//         res.status(500).json({
//             success: false,
//             message: "Server error: Could not retrieve property.",
//             error: error.message
//         });
//     }
// };

// // Update an existing property by ID
// export const updateProperty = async (req: Request, res: Response) => {
//     const newUploadedFiles = req.files as Express.Multer.File[];
//     console.log("New Uploaded Files for Update:", newUploadedFiles);
//     console.log("REQ BODY (Update):", req.body);

//     try {
//         const { id } = req.params;
//         const {
//             title,
//             location,
//             address,
//             rentRange: rentRangeString,
//             totalBeds,
//             monthlyRevenue,
//             contactPerson,
//             contactPhone,
//             status,
//             description,
//             amenities,
//             existingImages
//         } = req.body;

//         const property = await Property.findById(id);

//         if (!property) {
//             // Clean up newly uploaded files if property not found
//             newUploadedFiles.forEach(file => {
//                 fs.unlink(file.path, (err) => {
//                     if (err) console.error("Error deleting new file after property not found:", err);
//                 });
//             });
//             return res.status(404).json({
//                 success: false,
//                 message: "Property not found."
//             });
//         }

//         // Parse rentRange string for update
//         const { minRent: updatedMinRent, maxRent: updatedMaxRent } = parseRentRangeString(rentRangeString);

//         if (updatedMinRent === null || updatedMaxRent === null) {
//             newUploadedFiles.forEach(file => { fs.unlink(file.path, (err) => { if (err) console.error("Error deleting new file after rentRange parsing error:", err); }); });
//             return res.status(400).json({ success: false, message: "Invalid rent range format provided for update." });
//         }

//         // Prepare the updated data. Ensure numbers are parsed correctly.
//         const updatedData: Partial<IProperty> = {
//             title,
//             location,
//             address,
//             // rentRange: rentRangeString,
//             minRent: updatedMinRent,
//             maxRent: updatedMaxRent,
//             totalBeds: parseInt(totalBeds as string, 10) || 0,
//             monthlyRevenue: parseInt(monthlyRevenue as string, 10) || 0,
//             contactPerson,
//             contactPhone,
//             status,
//             description,
//             amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
//         };

//         // Handle images: Combine existing images (that were not removed) and new uploads
//         let finalImages: string[] = [];

//         if (existingImages) {
//             finalImages = Array.isArray(existingImages) ? existingImages : [existingImages];
//         }
//         const newImagePaths = newUploadedFiles.map(file => `/uploads/${file.filename}`);
//         finalImages = [...finalImages, ...newImagePaths];

//         if (finalImages.length > 3) {
//             newUploadedFiles.forEach(file => {
//                 fs.unlink(file.path, (err) => {
//                     if (err) console.error("Error deleting new file due to image count limit:", err);
//                 });
//             });
//             return res.status(400).json({ success: false, message: "Maximum 3 images allowed in total." });
//         }

//         const imagesToDelete = property.images?.filter(imgUrl => !finalImages.includes(imgUrl)) || [];

//         imagesToDelete.forEach(imgUrl => {
//             const filename = path.basename(imgUrl);
//             const filePath = path.join(uploadsDir, filename);
//             fs.unlink(filePath, (err) => {
//                 if (err) console.error(`Error deleting old image file ${filePath}:`, err);
//             });
//         });

//         updatedData.images = finalImages;

//         const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, {
//             new: true,
//             runValidators: true
//         });

//         if (!updatedProperty) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Property not found after update attempt."
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Property updated successfully.",
//             data: updatedProperty
//         });
//     } catch (error: any) {
//         console.error("Error updating property:", error);
//         newUploadedFiles.forEach(file => {
//             fs.unlink(file.path, (err) => {
//                 if (err) console.error("Error deleting new file after update DB error:", err);
//             });
//         });

//         if (error.name === 'CastError') {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Property ID format."
//             });
//         }
//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map((val: any) => val.message);
//             return res.status(400).json({
//                 success: false,
//                 error: messages
//             });
//         }
//         res.status(500).json({
//             success: false,
//             message: "Server error: Could not update property.",
//             error: error.message
//         });
//     }
// };

// // Update only the status of a property by ID
// export const updatePropertyStatus = async (req: Request, res: Response) => {
//     try {
//         const { status } = req.body;

//         if (!status) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Status field is required for status update."
//             });
//         }

//         const allowedStatuses = ['active', 'inactive', 'maintenance', 'full', 'available soon'];
//         if (!allowedStatuses.includes(status)) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Invalid status value. Allowed values are: ${allowedStatuses.join(', ')}.`
//             });
//         }

//         const property = await Property.findByIdAndUpdate(
//             req.params.id,
//             { status: status },
//             {
//                 new: true, // Return the updated document
//                 runValidators: true // Run schema validators
//             }
//         );

//         if (!property) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Property not found."
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Property status updated successfully.",
//             data: property
//         });
//     } catch (error: any) {
//         console.error("Error updating property status:", error);
//         if (error.name === 'CastError') {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Property ID format."
//             });
//         }
//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map((val: any) => val.message);
//             return res.status(400).json({
//                 success: false,
//                 error: messages
//             });
//         }
//         res.status(500).json({
//             success: false,
//             message: "Server error: Could not update property status.",
//             error: error.message
//         });
//     }
// };

// // Delete a property by ID and associated beds/payments
// export const deleteProperty = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         // Find the property first to get image paths for deletion
//         const property = await Property.findById(id);

//         if (!property) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Property not found."
//             });
//         }

//         // --- NEW: Implement Cascading Deletion for associated records ---
//         // Delete all beds associated with this property
//         await Bed.deleteMany({ propertyId: id });
    
//         await Property.findByIdAndDelete(id);

//         // Delete associated image files from the file system
//         property.images?.forEach(imgUrl => {
//             const filename = path.basename(imgUrl);
//             const filePath = path.join(uploadsDir, filename);
//             fs.unlink(filePath, (err) => {
//                 if (err) console.error(`Error deleting image file ${filePath}:`, err);
//             });
//         });

//         res.status(200).json({
//             success: true,
//             message: "Property and its associated beds (and payments) deleted successfully.",
//             // It's common to return the deleted item's ID or a confirmation, not the full deleted object.
//             data: { id: id }
//         });
//     } catch (error: any) {
//         console.error("Error deleting property:", error);
//         if (error.name === 'CastError') {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Property ID format."
//             });
//         }
//         res.status(500).json({
//             success: false,
//             message: "Server error: Could not delete property.",
//             error: error.message
//         });
//     }
// };


import { Request, Response } from 'express';
import { Property, IProperty } from '../model/Property';
import { Bed } from '../model/beds';
import multer from 'multer';
import ImageKit from "imagekit";
import dotenv from "dotenv";
import { UploadResponse, BulkDeleteFilesResponse } from "imagekit/dist/libs/interfaces";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT || "",
});

// Multer setup for in-memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  }
}).array('images', 3); // 'images' is the field name, max 3 files

// Upload function to ImageKit
export const uploadToImageKit = async (
  file: Express.Multer.File,
  folderName: string
): Promise<UploadResponse> => {
  const response = await imagekit.upload({
    file: file.buffer, // file buffer from multer
    fileName: `${Date.now()}_${file.originalname}`,
    folder: `/${folderName}`,
  });
  return response;
};

// Delete function from ImageKit
export const deleteFromImageKit = async (fileId: string): Promise<any> => {
  const response = await imagekit.deleteFile(fileId);
  return response;
};

// Helper function to parse frontend price range string into min/max numbers
const parseRentRangeString = (rentRangeString: string) => {
  let min: number = 0;
  let max: number = Infinity;

  if (!rentRangeString || typeof rentRangeString !== 'string') {
    return { minRent: null, maxRent: null };
  }

  const cleanString = rentRangeString.replace(/[₹$,\s]/g, '');

  if (cleanString.includes('-')) {
    const parts = cleanString.split('-');
    min = parseInt(parts[0], 10);
    max = parseInt(parts[1], 10);
  } else if (cleanString.toLowerCase().includes('under')) {
    const value = parseInt(cleanString.toLowerCase().replace('under', ''), 10);
    min = 0;
    max = value;
  } else if (cleanString.toLowerCase().includes('above')) {
    const value = parseInt(cleanString.toLowerCase().replace('above', ''), 10);
    min = value;
    max = Infinity;
  } else {
    const singleValue = parseInt(cleanString, 10);
    min = singleValue;
    max = singleValue;
  }

  if (isNaN(min)) min = 0;
  if (isNaN(max)) max = Infinity;

  return { minRent: min, maxRent: max };
};

export const createProperty = async (req: Request, res: Response) => {
  const uploadedFiles = req?.files as Express.Multer.File[];
  let uploadedImageKitFiles: UploadResponse[] = [];

  try {
    const {
      title,
      location,
      address,
      rentRange: rentRangeString,
      totalBeds,
      monthlyRevenue,
      contactPerson,
      contactPhone,
      status,
      description,
      amenities
    } = req.body;

    const { minRent, maxRent } = parseRentRangeString(rentRangeString);

    if (!title || !location || !address || minRent === null || maxRent === null || !totalBeds || !monthlyRevenue || !contactPerson || !contactPhone || !status || !description) {
      return res.status(400).json({ message: "All required fields are missing or rent range format is invalid." });
    }

    const parsedTotalBeds = parseInt(totalBeds as string, 10);
    if (isNaN(parsedTotalBeds) || parsedTotalBeds <= 0) {
      return res.status(400).json({ message: "Total Beds must be a positive number." });
    }

    if (uploadedFiles && uploadedFiles.length > 0) {
      const uploadPromises = uploadedFiles.map(file => uploadToImageKit(file, 'properties'));
      uploadedImageKitFiles = await Promise.all(uploadPromises);
    }

    const imageKitFileDetails = uploadedImageKitFiles.map(file => ({
      fileId: file.fileId,
      url: file.url
    }));

    const newProperty = new Property({
      title,
      location,
      address,
      rentRange: rentRangeString,
      minRent,
      maxRent,
      totalBeds: parsedTotalBeds,
      monthlyRevenue,
      contactPerson,
      contactPhone,
      status,
      description,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
      images: imageKitFileDetails
    });

    await newProperty.save();

    const bedsToCreate = [];
    for (let i = 1; i <= parsedTotalBeds; i++) {
      bedsToCreate.push({
        propertyId: newProperty.id,
        bedNumber: `${newProperty.id}-Bed ${i}`,
        status: 'vacant',
        tenantDetails: {}
      });
    }
    await Bed.insertMany(bedsToCreate);

    res.status(201).json({
      success: true,
      message: "Property created successfully, and beds initialized.",
      data: newProperty
    });

  } catch (error: any) {
    console.error("Error creating property:", error);
    // If an error occurs, delete any images that were successfully uploaded
    if (uploadedImageKitFiles.length > 0) {
      const deletePromises = uploadedImageKitFiles.map(file => deleteFromImageKit(file.fileId));
      await Promise.all(deletePromises);
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
      message: "Server error: Could not create property.",
      error: error.message
    });
  }
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { search, area, price: priceFilterString, occupancy, sortBy, requirement } = req.query;
    let conditions: any[] = [];
    let sort: any = {};

    if (search && typeof search === 'string') {
      conditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (area && typeof area === 'string') {
      conditions.push({ location: { $regex: area, $options: 'i' } });
    }

    if (priceFilterString && typeof priceFilterString === 'string') {
      const { minRent: filterMinPrice, maxRent: filterMaxPrice } = parseRentRangeString(priceFilterString);
      if (filterMinPrice !== null && filterMaxPrice !== null) {
        conditions.push(
          { maxRent: { $gte: filterMinPrice } },
          { minRent: { $lte: filterMaxPrice } }
        );
      }
    }

    if (occupancy && typeof occupancy === 'string') {
      let bedsCount: number | undefined;
      switch (occupancy.toLowerCase()) {
        case 'single': bedsCount = 1; break;
        case 'double': bedsCount = 2; break;
        case 'triple': bedsCount = 3; break;
        case 'quad': bedsCount = 4; break;
      }
      if (bedsCount !== undefined) {
        conditions.push({ totalBeds: bedsCount });
      }
    }

    if (requirement && typeof requirement === 'string') {
      conditions.push({
        $or: [
          { description: { $regex: requirement, $options: 'i' } },
          { title: { $regex: requirement, $options: 'i' } }
        ]
      });
    }

    let query: any = {};
    if (conditions.length > 0) {
      query.$and = conditions;
    }

    if (sortBy && typeof sortBy === 'string') {
      if (sortBy === 'price-low') {
        sort.minRent = 1;
      } else if (sortBy === 'price-high') {
        sort.minRent = -1;
      }
    }

    const properties = await Property.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error: any) {
    console.error("Error fetching properties with filters:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Could not retrieve properties with filters.",
      error: error.message
    });
  }
};

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

export const updateProperty = async (req: Request, res: Response) => {
  const newUploadedFiles = req.files as Express.Multer.File[];
  let newUploadedImageKitFiles: UploadResponse[] = [];

  try {
    const { id } = req.params;
    const {
      title,
      location,
      address,
      rentRange: rentRangeString,
      totalBeds,
      monthlyRevenue,
      contactPerson,
      contactPhone,
      status,
      description,
      amenities,
      existingImages
    } = req.body;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found."
      });
    }

    const { minRent: updatedMinRent, maxRent: updatedMaxRent } = parseRentRangeString(rentRangeString);

    if (updatedMinRent === null || updatedMaxRent === null) {
      return res.status(400).json({ success: false, message: "Invalid rent range format provided for update." });
    }

    // Prepare updated data
    const updatedData: Partial<IProperty> = {
      title,
      location,
      address,
      minRent: updatedMinRent,
      maxRent: updatedMaxRent,
      totalBeds: parseInt(totalBeds as string, 10) || 0,
      monthlyRevenue: parseInt(monthlyRevenue as string, 10) || 0,
      contactPerson,
      contactPhone,
      status,
      description,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
    };

    // Handle images: Combine existing images and new uploads
    let finalImages: { fileId: string; url: string }[] = [];

    if (existingImages) {
      const parsedExistingImages = JSON.parse(existingImages);
      finalImages = Array.isArray(parsedExistingImages) ? parsedExistingImages : [parsedExistingImages];
    }

    if (newUploadedFiles && newUploadedFiles.length > 0) {
      const uploadPromises = newUploadedFiles.map(file => uploadToImageKit(file, 'properties'));
      newUploadedImageKitFiles = await Promise.all(uploadPromises);
      const newImageKitFileDetails = newUploadedImageKitFiles.map(file => ({
        fileId: file.fileId,
        url: file.url
      }));
      finalImages = [...finalImages, ...newImageKitFileDetails];
    }

    if (finalImages.length > 3) {
      return res.status(400).json({ success: false, message: "Maximum 3 images allowed in total." });
    }

    // Identify images to delete from ImageKit
    const oldImageFileIds = property.images?.map((img:any) => img.fileId) || [];
    const newImageFileIds = finalImages.map((img:any) => img.fileId);
    const imageIdsToDelete = oldImageFileIds.filter(id => !newImageFileIds.includes(id));

    if (imageIdsToDelete.length > 0) {
      const deletePromises = imageIdsToDelete.map(fileId => deleteFromImageKit(fileId));
      await Promise.all(deletePromises);
    }

    updatedData.images = finalImages;

    const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found after update attempt."
      });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully.",
      data: updatedProperty
    });
  } catch (error: any) {
    console.error("Error updating property:", error);
    // If an error occurs, delete any newly uploaded images from ImageKit
    if (newUploadedImageKitFiles.length > 0) {
      const deletePromises = newUploadedImageKitFiles.map(file => deleteFromImageKit(file.fileId));
      await Promise.all(deletePromises);
    }
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

export const updatePropertyStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required for status update."
      });
    }

    const allowedStatuses = ['active', 'inactive', 'maintenance', 'full', 'available soon'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Allowed values are: ${allowedStatuses.join(', ')}.`
      });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id, { status: status }, { new: true, runValidators: true }
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

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found."
      });
    }

    await Bed.deleteMany({ propertyId: id });
    await Property.findByIdAndDelete(id);

    if (property.images && property.images.length > 0) {
      const fileIdsToDelete = property.images.map((img:any) => img.fileId);
      const deletePromises = fileIdsToDelete.map(fileId => deleteFromImageKit(fileId));
      await Promise.all(deletePromises);
    }

    res.status(200).json({
      success: true,
      message: "Property and its associated beds deleted successfully.",
      data: { id: id }
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