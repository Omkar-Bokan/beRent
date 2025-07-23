import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for your User document
export interface IUser extends Document {
  phone: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema({ // Add interface to schema
  phone: { type: String, required: true, unique: true }, // Changed to String as phone numbers can contain non-digits
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true, // Assuming you want timestamps for users too
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

export const User = mongoose.model<IUser>('User', userSchema);
// export default mongoose.model('User', userSchema); // Prefer named export