import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';
import type { DashboardStats, Course } from '../types';

const DashboardPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'teacher';
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const courseList = await courseService.list();
        setCourses(courseList.slice(0, 4));
        if (canManage) {
          const s = await studentService.stats();
          setStats(s);
        }
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || 'Failed to load dashboard';
        setError(message);
      }
    };
    load();
  }, [canManage]);

  const maxDept =
    stats?.byDepartment.reduce((m, d) => Math.max(m, d.count), 0) || 1;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Hello {user?.name} — here is your campus overview.</p>
        </div>
        {canManage && (
          <Link className="btn btn-primary" to="/students">
            Manage students
          </Link>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      {canManage && stats && (
        <div className="stats-grid">
          <div className="stat-tile">
            <span>Total students</span>
            <strong>{stats.totalStudents}</strong>
          </div>
          <div className="stat-tile">
            <span>Active students</span>
            <strong>{stats.activeStudents}</strong>
          </div>
          <div className="stat-tile">
            <span>Active courses</span>
            <strong>{stats.totalCourses}</strong>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: canManage ? '1.2fr 0.8fr' : '1fr', gap: '1rem' }}>
        <section className="panel">
          <div className="page-header" style={{ marginBottom: '0.75rem' }}>
            <h2>Courses</h2>
            <Link to="/courses">View all</Link>
          </div>
          <div className="course-grid">
            {courses.map((c) => (
              <article key={c._id} className="course-tile">
                <div className="code">{c.code}</div>
                <h3>{c.name}</h3>
                <p>{c.description || 'No description'}</p>
                <strong>{c.credits} credits</strong>
              </article>
            ))}
            {courses.length === 0 && <p className="empty">No courses yet.</p>}
          </div>
        </section>

        {canManage && stats && (
          <section className="panel">
            <h2>By department</h2>
            <div className="dept-list">
              {stats.byDepartment.map((d) => (
                <div className="dept-row" key={d._id}>
                  <span>{d._id}</span>
                  <div className="bar">
                    <span style={{ width: `${(d.count / maxDept) * 100}%` }} />
                  </div>
                  <strong>{d.count}</strong>
                </div>
              ))}
              {stats.byDepartment.length === 0 && (
                <p className="empty">No department data yet.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
