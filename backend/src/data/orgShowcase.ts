/**
 * Official CampusLedger organization showcase dataset.
 * Used for classroom demos — keep this list stable so every workshop
 * sees the same students, courses, and login accounts.
 */
export const ORG_META = {
  name: 'CampusLedger Demo College',
  tagline: 'Official workshop organization database',
};

export const ORG_ADMIN = {
  name: 'Campus Admin',
  email: 'admin@sms.edu',
  password: 'Admin@123',
  role: 'admin' as const,
};

export const ORG_TEACHER = {
  name: 'Priya Sharma',
  email: 'priya@sms.edu',
  password: 'Teacher@123',
  role: 'teacher' as const,
};

export const ORG_COURSES = [
  {
    name: 'Data Structures',
    code: 'CSE201',
    description: 'Arrays, linked lists, trees, graphs and complexity analysis',
    credits: 4,
  },
  {
    name: 'Database Systems',
    code: 'CSE301',
    description: 'Relational models, SQL, and NoSQL fundamentals',
    credits: 3,
  },
  {
    name: 'Web Development',
    code: 'CSE350',
    description: 'Full-stack web apps with MERN concepts',
    credits: 4,
  },
  {
    name: 'Operating Systems',
    code: 'CSE220',
    description: 'Processes, memory, file systems and concurrency',
    credits: 3,
  },
];

export const ORG_STUDENTS = [
  {
    name: 'Arjun Reddy',
    email: 'arjun@student.edu',
    password: 'Student@123',
    roll: 'CSE2024001',
    dept: 'Computer Science',
    year: 2,
    sem: 3,
    gpa: 8.6,
  },
  {
    name: 'Sneha Patel',
    email: 'sneha@student.edu',
    password: 'Student@123',
    roll: 'CSE2024002',
    dept: 'Computer Science',
    year: 2,
    sem: 3,
    gpa: 9.1,
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul@student.edu',
    password: 'Student@123',
    roll: 'ECE2023015',
    dept: 'Electronics',
    year: 3,
    sem: 5,
    gpa: 7.8,
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya@student.edu',
    password: 'Student@123',
    roll: 'CSE2023010',
    dept: 'Computer Science',
    year: 3,
    sem: 5,
    gpa: 8.9,
  },
  {
    name: 'Vikram Singh',
    email: 'vikram@student.edu',
    password: 'Student@123',
    roll: 'MECH2022012',
    dept: 'Mechanical',
    year: 4,
    sem: 7,
    gpa: 7.2,
  },
];

/** Emails that belong to the official org showcase (never treated as test junk). */
export const ORG_EMAILS = new Set([
  ORG_ADMIN.email,
  ORG_TEACHER.email,
  ...ORG_STUDENTS.map((s) => s.email),
]);
