import { useEffect, useState } from 'react';
import { Col, Row, Card, Statistic, Typography, Button, Progress, Space, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { TeamOutlined, CheckCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';
import CourseCard from '../components/courses/CourseCard';
import type { Course, DashboardStats } from '../types';
import { getErrorMessage } from '../utils/errorMessage';

const DashboardPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'teacher';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const courseList = await courseService.list();
        setCourses(courseList.slice(0, 4));
        if (canManage) {
          setStats(await studentService.stats());
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load dashboard'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [canManage]);

  const maxDept =
    stats?.byDepartment.reduce((max, item) => Math.max(max, item.count), 0) || 1;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            Dashboard
          </Typography.Title>
          <Typography.Text type="secondary">
            Hello {user?.name} — here is your campus overview.
          </Typography.Text>
        </Col>
        {canManage && (
          <Col>
            <Link to="/students">
              <Button type="primary">Manage students</Button>
            </Link>
          </Col>
        )}
      </Row>

      {error && <Alert type="error" showIcon message={error} />}

      <Spin spinning={loading}>
        {canManage && stats && (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card className="page-card">
                <Statistic
                  title="Total students"
                  value={stats.totalStudents}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="page-card">
                <Statistic
                  title="Active students"
                  value={stats.activeStudents}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="page-card">
                <Statistic
                  title="Active courses"
                  value={stats.totalCourses}
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
          </Row>
        )}

        <Row gutter={[16, 16]} style={{ marginTop: canManage ? 16 : 0 }}>
          <Col xs={24} lg={canManage ? 14 : 24}>
            <Card
              className="page-card"
              title="Courses"
              extra={<Link to="/courses">View all</Link>}
            >
              <Row gutter={[16, 16]}>
                {courses.map((course) => (
                  <Col xs={24} sm={12} key={course._id}>
                    <CourseCard course={course} />
                  </Col>
                ))}
                {courses.length === 0 && (
                  <Col span={24}>
                    <Typography.Text type="secondary">No courses yet.</Typography.Text>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>

          {canManage && stats && (
            <Col xs={24} lg={10}>
              <Card className="page-card" title="By department">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {stats.byDepartment.map((dept) => (
                    <div key={dept._id}>
                      <Row justify="space-between">
                        <Typography.Text>{dept._id}</Typography.Text>
                        <Typography.Text strong>{dept.count}</Typography.Text>
                      </Row>
                      <Progress
                        percent={Math.round((dept.count / maxDept) * 100)}
                        showInfo={false}
                        strokeColor="#0b6e75"
                      />
                    </div>
                  ))}
                  {stats.byDepartment.length === 0 && (
                    <Typography.Text type="secondary">No department data yet.</Typography.Text>
                  )}
                </Space>
              </Card>
            </Col>
          )}
        </Row>
      </Spin>
    </Space>
  );
};

export default DashboardPage;
