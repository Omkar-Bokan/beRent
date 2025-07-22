import { Request, Response } from 'express';
import Property from '../model/Property';

// -------------------- Add Property --------------------
export const addProperty = async (req: Request, res: Response): Promise<void> => {
     console.log("Inside addProperty Controller");
    console.log("REQ BODY:", req.body);
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

        if (!title || !location || !address || !rentRange || !totalBeds || !monthlyRevenue || !contactPerson || !contactPhone || !status || !description) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

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
            amenities
        });

        await newProperty.save();
        res.status(201).json(newProperty);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};


// -------------------- Create Property (Generic) --------------------
// export const createProperty = async (req: Request, res: Response): Promise<void> => {
//     console.log("REQ BODY:", req.body);
//     try {
//         const newProperty = new Property(req.body);
//         await newProperty.save();
//         res.status(201).json(newProperty);
//     } catch (error) {
//         console.error(error);
//         if (error instanceof Error) {
//             res.status(400).json({ message: error.message });
//         } else {
//             res.status(400).json({ message: "An unknown error occurred" });
//         }
//     }
// };


// -------------------- Get All Properties --------------------
export const getProperties = async (req: Request, res: Response): Promise<void> => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

