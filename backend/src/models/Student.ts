import mongoose, { Document, Schema, Types } from 'mongoose';

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended';

export interface IStudent extends Document {
  user: Types.ObjectId;
  rollNumber: string;
  department: string;
  year: number;
  semester: number;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  courses: Types.ObjectId[];
  status: StudentStatus;
  gpa?: number;
}

const studentSchema = new Schema<IStudent>(
  {
    // Link to User account so login credentials stay separate from
    // academic profile data (separation of auth vs domain data).
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 5 },
    semester: { type: Number, required: true, min: 1, max: 10 },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    dateOfBirth: { type: Date },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'suspended'],
      default: 'active',
    },
    gpa: { type: Number, min: 0, max: 10 },
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>('Student', studentSchema);
