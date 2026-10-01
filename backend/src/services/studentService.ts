import { Student } from '../models/Student';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';

export const listStudents = async (query: {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const filter: Record<string, unknown> = {};

  if (query.department) filter.department = query.department;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { rollNumber: { $regex: query.search, $options: 'i' } },
      { department: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [students, total] = await Promise.all([
    Student.find(filter)
      .populate('user', 'name email')
      .populate('courses', 'name code credits')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Student.countDocuments(filter),
  ]);

  return {
    students,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getStudentById = async (id: string) => {
  const student = await Student.findById(id)
    .populate('user', 'name email role')
    .populate('courses', 'name code credits');
  if (!student) throw new AppError('Student not found', 404, 'STUDENT_NOT_FOUND');
  return student;
};

export const createStudent = async (input: {
  name: string;
  email: string;
  password?: string;
  rollNumber: string;
  department: string;
  year: number;
  semester: number;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  courses?: string[];
  gpa?: number;
}) => {
  const existingUser = await User.findOne({ email: input.email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  const existingRoll = await Student.findOne({
    rollNumber: input.rollNumber.toUpperCase(),
  });
  if (existingRoll) {
    throw new AppError('Roll number already exists', 409, 'ROLL_EXISTS');
  }

  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password || 'Student@123',
    role: 'student',
  });

  const student = await Student.create({
    user: user._id,
    rollNumber: input.rollNumber.toUpperCase(),
    department: input.department,
    year: input.year,
    semester: input.semester,
    phone: input.phone,
    address: input.address,
    dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
    courses: input.courses || [],
    gpa: input.gpa,
  });

  return Student.findById(student._id)
    .populate('user', 'name email')
    .populate('courses', 'name code credits');
};

export const updateStudent = async (
  id: string,
  input: Partial<{
    name: string;
    department: string;
    year: number;
    semester: number;
    phone: string;
    address: string;
    dateOfBirth: string;
    courses: string[];
    status: string;
    gpa: number;
  }>
) => {
  const student = await Student.findById(id);
  if (!student) throw new AppError('Student not found', 404, 'STUDENT_NOT_FOUND');

  if (input.name) {
    await User.findByIdAndUpdate(student.user, { name: input.name });
  }

  if (input.department !== undefined) student.department = input.department;
  if (input.year !== undefined) student.year = input.year;
  if (input.semester !== undefined) student.semester = input.semester;
  if (input.phone !== undefined) student.phone = input.phone;
  if (input.address !== undefined) student.address = input.address;
  if (input.dateOfBirth) student.dateOfBirth = new Date(input.dateOfBirth);
  if (input.courses) student.courses = input.courses as never;
  if (input.status) student.status = input.status as never;
  if (input.gpa !== undefined) student.gpa = input.gpa;

  await student.save();
  return Student.findById(id)
    .populate('user', 'name email')
    .populate('courses', 'name code credits');
};

export const deleteStudent = async (id: string) => {
  const student = await Student.findById(id);
  if (!student) throw new AppError('Student not found', 404, 'STUDENT_NOT_FOUND');

  await User.findByIdAndDelete(student.user);
  await student.deleteOne();
  return { id };
};

export const getDashboardStats = async () => {
  const [totalStudents, activeStudents, totalCourses, byDepartment] =
    await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'active' }),
      (await import('../models/Course')).Course.countDocuments({ isActive: true }),
      Student.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

  return { totalStudents, activeStudents, totalCourses, byDepartment };
};
