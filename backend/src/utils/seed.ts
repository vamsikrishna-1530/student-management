import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { Student } from '../models/Student';

// Seed script populates demo data so the workshop/demo can start
// without manually creating every record through the UI.
const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Student.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@sms.edu',
    password: 'Admin@123',
    role: 'admin',
  });

  const teacher = await User.create({
    name: 'Priya Sharma',
    email: 'priya@sms.edu',
    password: 'Teacher@123',
    role: 'teacher',
  });

  const courses = await Course.insertMany([
    {
      name: 'Data Structures',
      code: 'CSE201',
      description: 'Arrays, linked lists, trees, graphs and complexity analysis',
      credits: 4,
      teacher: teacher._id,
    },
    {
      name: 'Database Systems',
      code: 'CSE301',
      description: 'Relational models, SQL, and NoSQL fundamentals',
      credits: 3,
      teacher: teacher._id,
    },
    {
      name: 'Web Development',
      code: 'CSE350',
      description: 'Full-stack web apps with MERN concepts',
      credits: 4,
      teacher: teacher._id,
    },
    {
      name: 'Operating Systems',
      code: 'CSE220',
      description: 'Processes, memory, file systems and concurrency',
      credits: 3,
    },
  ]);

  const studentsData = [
    {
      name: 'Arjun Reddy',
      email: 'arjun@student.edu',
      roll: 'CSE2024001',
      dept: 'Computer Science',
      year: 2,
      sem: 3,
      gpa: 8.6,
    },
    {
      name: 'Sneha Patel',
      email: 'sneha@student.edu',
      roll: 'CSE2024002',
      dept: 'Computer Science',
      year: 2,
      sem: 3,
      gpa: 9.1,
    },
    {
      name: 'Rahul Mehta',
      email: 'rahul@student.edu',
      roll: 'ECE2023015',
      dept: 'Electronics',
      year: 3,
      sem: 5,
      gpa: 7.8,
    },
    {
      name: 'Ananya Iyer',
      email: 'ananya@student.edu',
      roll: 'CSE2023010',
      dept: 'Computer Science',
      year: 3,
      sem: 5,
      gpa: 8.9,
    },
    {
      name: 'Vikram Singh',
      email: 'vikram@student.edu',
      roll: 'MECH2022012',
      dept: 'Mechanical',
      year: 4,
      sem: 7,
      gpa: 7.2,
    },
  ];

  for (const s of studentsData) {
    const user = await User.create({
      name: s.name,
      email: s.email,
      password: 'Student@123',
      role: 'student',
    });
    await Student.create({
      user: user._id,
      rollNumber: s.roll,
      department: s.dept,
      year: s.year,
      semester: s.sem,
      gpa: s.gpa,
      phone: '9876543210',
      status: 'active',
      courses: [courses[0]._id, courses[1]._id],
    });
  }

  console.log('Seed completed');
  console.log('Admin:   admin@sms.edu / Admin@123');
  console.log('Teacher: priya@sms.edu / Teacher@123');
  console.log('Student: arjun@student.edu / Student@123');
  console.log(`Admin id: ${admin._id}`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
