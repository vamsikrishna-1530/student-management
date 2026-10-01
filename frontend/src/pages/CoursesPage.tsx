import { useEffect, useState, type FormEvent } from 'react';
import { courseService } from '../services/courseService';
import type { Course } from '../types';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  name: '',
  code: '',
  description: '',
  credits: 3,
};

const CoursesPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      setError('');
      const list = await courseService.list(search || undefined);
      setCourses(list);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to load courses';
      setError(message);
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

  const openEdit = (course: Course) => {
    setEditing(course);
    setForm({
      name: course.name,
      code: course.code,
      description: course.description || '',
      credits: course.credits,
    });
    setModalOpen(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await courseService.update(editing._id, {
          name: form.name,
          description: form.description,
          credits: Number(form.credits),
        });
      } else {
        await courseService.create({
          name: form.name,
          code: form.code,
          description: form.description,
          credits: Number(form.credits),
        });
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
    if (!confirm('Deactivate this course?')) return;
    try {
      await courseService.remove(id);
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
          <h1>Courses</h1>
          <p>Browse the catalog and manage offerings.</p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={openCreate}>
            Add course
          </button>
        )}
      </div>

      <section className="panel">
        <div className="toolbar">
          <input
            placeholder="Search courses"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-ghost" onClick={load}>
            Search
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="course-grid">
          {courses.map((c) => (
            <article key={c._id} className="course-tile">
              <div className="code">{c.code}</div>
              <h3>{c.name}</h3>
              <p>{c.description || 'No description provided.'}</p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <strong>{c.credits} credits</strong>
                {canManage && (
                  <div className="row-actions">
                    <button className="btn btn-ghost" onClick={() => openEdit(c)}>
                      Edit
                    </button>
                    {isAdmin && (
                      <button className="btn btn-danger" onClick={() => onDelete(c._id)}>
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        {courses.length === 0 && <p className="empty">No courses found.</p>}
      </section>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header>
              <h2>{editing ? 'Edit course' : 'Add course'}</h2>
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
                  Code
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    required
                  />
                </label>
              )}
              <label>
                Credits
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.credits}
                  onChange={(e) =>
                    setForm({ ...form, credits: Number(e.target.value) })
                  }
                  required
                />
              </label>
              <label className="full">
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
              <div className="full">
                <button className="btn btn-primary" type="submit">
                  {editing ? 'Save changes' : 'Create course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
