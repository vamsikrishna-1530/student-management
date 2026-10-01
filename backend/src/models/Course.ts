import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  code: string;
  description: string;
  credits: number;
  teacher?: Types.ObjectId;
  isActive: boolean;
}

const courseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    credits: { type: Number, required: true, min: 1, max: 10 },
    teacher: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>('Course', courseSchema);
