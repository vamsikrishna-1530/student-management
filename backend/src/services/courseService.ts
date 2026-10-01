import { Course } from '../models/Course';
import { AppError } from '../utils/AppError';

export const listCourses = async (search?: string) => {
  const filter: Record<string, unknown> = { isActive: true };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ];
  }
  return Course.find(filter)
    .populate('teacher', 'name email')
    .sort({ code: 1 });
};

export const getCourseById = async (id: string) => {
  const course = await Course.findById(id).populate('teacher', 'name email');
  if (!course) throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
  return course;
};

export const createCourse = async (input: {
  name: string;
  code: string;
  description?: string;
  credits: number;
  teacher?: string;
}) => {
  const exists = await Course.findOne({ code: input.code.toUpperCase() });
  if (exists) throw new AppError('Course code already exists', 409, 'CODE_EXISTS');

  return Course.create({
    name: input.name,
    code: input.code.toUpperCase(),
    description: input.description || '',
    credits: input.credits,
    teacher: input.teacher,
  });
};

export const updateCourse = async (
  id: string,
  input: Partial<{
    name: string;
    description: string;
    credits: number;
    teacher: string;
    isActive: boolean;
  }>
) => {
  const course = await Course.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  }).populate('teacher', 'name email');
  if (!course) throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
  return course;
};

export const deleteCourse = async (id: string) => {
  // Soft delete keeps historical enrollment references valid.
  const course = await Course.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!course) throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
  return course;
};
