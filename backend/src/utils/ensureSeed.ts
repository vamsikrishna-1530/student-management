import { User } from '../models/User';
import { Course } from '../models/Course';
import { Student } from '../models/Student';
import {
  ORG_ADMIN,
  ORG_COURSES,
  ORG_META,
  ORG_STUDENTS,
  ORG_TEACHER,
  ORG_EMAILS,
} from '../data/orgShowcase';

type SyncOptions = {
  /** Wipe non-org / all collections, then install only official showcase data. */
  reset?: boolean;
};

const upsertUser = async (input: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
}) => {
  const email = input.email.toLowerCase();
  let user = await User.findOne({ email }).select('+password');
  if (!user) {
    user = await User.create({
      name: input.name,
      email,
      password: input.password,
      role: input.role,
    });
    return user;
  }

  user.name = input.name;
  user.role = input.role;
  // Keep password stable for workshop logins unless you intentionally reset DB.
  await user.save();
  return user;
};

/**
 * Maintain the Atlas database as the official organization showcase DB.
 * - Upserts admin, teacher, courses, and demo students
 * - Optional reset removes test/random accounts so demos stay clean
 */
export const syncOrgShowcase = async (
  options: SyncOptions = {}
): Promise<{ org: string; users: number; courses: number; students: number }> => {
  if (options.reset) {
    console.log('Resetting database to official org showcase…');
    await Promise.all([
      Student.deleteMany({}),
      Course.deleteMany({}),
      User.deleteMany({}),
    ]);
  } else {
    // Remove accidental test signups that are NOT part of the org dataset.
    const strayUsers = await User.find({
      email: { $nin: [...ORG_EMAILS] },
    });
    if (strayUsers.length > 0) {
      const ids = strayUsers.map((u) => u._id);
      await Student.deleteMany({ user: { $in: ids } });
      await User.deleteMany({ _id: { $in: ids } });
      console.log(`Removed ${strayUsers.length} non-org test user(s)`);
    }
  }

  console.log(`Syncing org showcase: ${ORG_META.name}`);

  await upsertUser(ORG_ADMIN);
  const teacher = await upsertUser(ORG_TEACHER);

  const courseDocs = [];
  for (const course of ORG_COURSES) {
    const doc = await Course.findOneAndUpdate(
      { code: course.code },
      {
        name: course.name,
        code: course.code,
        description: course.description,
        credits: course.credits,
        teacher: teacher._id,
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    courseDocs.push(doc);
  }

  const enrolled = courseDocs.slice(0, 2).map((c) => c!._id);

  for (const s of ORG_STUDENTS) {
    const user = await upsertUser({
      name: s.name,
      email: s.email,
      password: s.password,
      role: 'student',
    });

    await Student.findOneAndUpdate(
      { rollNumber: s.roll },
      {
        user: user._id,
        rollNumber: s.roll,
        department: s.dept,
        year: s.year,
        semester: s.sem,
        gpa: s.gpa,
        phone: '9876543210',
        status: 'active',
        courses: enrolled,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const [users, courses, students] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments({ isActive: true }),
    Student.countDocuments(),
  ]);

  console.log(
    `Org DB ready — admin@sms.edu / Admin@123 | users=${users} courses=${courses} students=${students}`
  );

  return { org: ORG_META.name, users, courses, students };
};

/** Startup hook: keep official org records present and strip stray test signups. */
export const ensureSeedData = async (): Promise<void> => {
  await syncOrgShowcase({ reset: false });
};
