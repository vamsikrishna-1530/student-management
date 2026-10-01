import { useEffect, useState, type FormEvent } from 'react';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';
import type { Student, Course } from '../types';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  name: '',
  email: '',
  password: 'Student@123',
  rollNumber: '',
  department: 'Computer Science',
  year: 1,
  semester: 1,
  phone: '',
  address: '',
  gpa: '',
  status: 'active',
  courses: [] as string[],
};

const StudentsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [list, courseList] = await Promise.all([
        studentService.list({ search, status: status || undefined, limit: 50 }),
        courseService.list(),
      ]);
      setStudents(list.students);
      setCourses(courseList);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to load students';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (student: Student) => {
    setEditing(student);
    setForm({
      name: student.user?.name || '',
      email: student.user?.email || '',
      password: '',
      rollNumber: student.rollNumber,
      department: student.department,
      year: student.year,
      semester: student.semester,
      phone: student.phone || '',
      address: student.address || '',
      gpa: student.gpa?.toString() || '',
      status: student.status,
      courses: student.courses?.map((c) => c._id) || [],
    });
    setModalOpen(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        rollNumber: form.rollNumber,
        department: form.department,
        year: Number(form.year),
        semester: Number(form.semester),
        phone: form.phone,
        address: form.address,
        gpa: form.gpa ? Number(form.gpa) : undefined,
        status: form.status,
        courses: form.courses,
      };

      if (editing) {
        await studentService.update(editing._id, payload);
      } else {
        await studentService.create(payload);
      }
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Save failed';
      setError(message);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this student and their login account?')) return;
    try {
      await studentService.remove(id);
      await load();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Delete failed';
      setError(message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>Create, update, search, and manage student records.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          Add student
        </button>
      </div>

      <section className="panel">
        <div className="toolbar">
          <input
            placeholder="Search roll / department"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="btn btn-ghost" onClick={load}>
            Search
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p className="empty">Loading students…</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll</th>
                  <th>Department</th>
                  <th>Year / Sem</th>
                  <th>GPA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <strong>{s.user?.name}</strong>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                        {s.user?.email}
                      </div>
                    </td>
                    <td>{s.rollNumber}</td>
                    <td>{s.department}</td>
                    <td>
                      Y{s.year} / S{s.semester}
                    </td>
                    <td>{s.gpa ?? '—'}</td>
                    <td>
                      <span className={`badge badge-${s.status}`}>{s.status}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-ghost" onClick={() => openEdit(s)}>
                          Edit
                        </button>
                        {isAdmin && (
                          <button
                            className="btn btn-danger"
                            onClick={() => onDelete(s._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && <p className="empty">No students found.</p>}
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header>
              <h2>{editing ? 'Edit student' : 'Add student'}</h2>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </header>
            <form className="form-grid" onSubmit={onSubmit}>
              <label>
                Name
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              {!editing && (
                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </label>
              )}
              {!editing && (
                <label>
                  Temp password
                  <input
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </label>
              )}
              <label>
                Roll number
                <input
                  value={form.rollNumber}
                  onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                  required
                  disabled={!!editing}
                />
              </label>
              <label>
                Department
                <input
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  required
                />
              </label>
              <label>
                Year
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  required
                />
              </label>
              <label>
                Semester
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.semester}
                  onChange={(e) =>
                    setForm({ ...form, semester: Number(e.target.value) })
                  }
                  required
                />
              </label>
              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label>
                GPA
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  value={form.gpa}
                  onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                />
              </label>
              {editing && (
                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </label>
              )}
              <label className="full">
                Address
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </label>
              <label className="full">
                Courses
                <select
                  multiple
                  value={form.courses}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      courses: Array.from(e.target.selectedOptions).map((o) => o.value),
                    })
                  }
                  style={{ minHeight: 100 }}
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="full" style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" type="submit">
                  {editing ? 'Save changes' : 'Create student'}
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
