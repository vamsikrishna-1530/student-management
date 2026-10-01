import { User } from '../models/User';
import { Course } from '../models/Course';
import { Student } from '../models/Student';

/**
 * Ensure demo login accounts exist after first Render deploy.
 * - If DB is empty: full demo dataset
 * - Always upsert the known demo admin so GitHub Pages login works
 */
export const ensureSeedData = async (): Promise<void> => {
  const adminEmail = 'admin@sms.edu';
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('Created demo admin — admin@sms.edu / Admin@123');
  }

  const existing = await User.countDocuments();
  if (existing > 1) {
    console.log(`Seed skipped for sample data — ${existing} user(s) already present`);
    return;
  }

  // Only the admin exists (just created or alone) — add sample catalog/users.
  console.log('Seeding sample teacher, courses, and students…');

  let teacher = await User.findOne({ email: 'priya@sms.edu' });
  if (!teacher) {
    teacher = await User.create({
      name: 'Priya Sharma',
      email: 'priya@sms.edu',
      password: 'Teacher@123',
      role: 'teacher',
    });
  }

  const courseCount = await Course.countDocuments();
  let courses = await Course.find();
  if (courseCount === 0) {
    courses = await Course.insertMany([
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
  }

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
    const already = await User.findOne({ email: s.email });
    if (already) continue;
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
      courses: courses.slice(0, 2).map((c) => c._id),
    });
  }

  console.log('Demo seed complete — admin@sms.edu / Admin@123');
};
