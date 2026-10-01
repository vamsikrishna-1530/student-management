import { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Card,
  Statistic,
  Typography,
  Button,
  Progress,
  Space,
  Alert,
  Spin,
  App,
} from 'antd';
import { Link } from 'react-router-dom';
import {
  TeamOutlined,
  CheckCircleOutlined,
  BookOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';
import { authService } from '../services/authService';
import CourseCard from '../components/courses/CourseCard';
import type { Course, DashboardStats } from '../types';
import { getErrorMessage } from '../utils/errorMessage';

const DashboardPage = () => {
  const { user } = useAuth();
  const { message, modal } = App.useApp();
  const canManage = user?.role === 'admin' || user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [orgName, setOrgName] = useState('CampusLedger Demo College');

  const load = async () => {
    setLoading(true);
    try {
      const cfg = await authService.getConfig();
      setOrgName(cfg.orgName);
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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage]);

  const syncOrgDb = (reset: boolean) => {
    modal.confirm({
      title: reset ? 'Reset org showcase database?' : 'Sync official org data?',
      content: reset
        ? 'This deletes ALL users/students/courses and restores only the official workshop dataset.'
        : 'Upserts official demo accounts/courses and removes stray test signups.',
      okType: reset ? 'danger' : 'primary',
      onOk: async () => {
        setSyncing(true);
        try {
          const result = await authService.syncOrgDb(reset);
          message.success(
            `${result.org}: ${result.users} users, ${result.students} students, ${result.courses} courses`
          );
          await load();
        } catch (err) {
          message.error(getErrorMessage(err, 'Org sync failed'));
        } finally {
          setSyncing(false);
        }
      },
    });
  };

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
            {orgName} — hello {user?.name}
          </Typography.Text>
        </Col>
        <Col>
          <Space wrap>
            {isAdmin && (
              <>
                <Button
                  icon={<DatabaseOutlined />}
                  loading={syncing}
                  onClick={() => syncOrgDb(false)}
                >
                  Sync org DB
                </Button>
                <Button danger loading={syncing} onClick={() => syncOrgDb(true)}>
                  Reset org DB
                </Button>
              </>
            )}
            {canManage && (
              <Link to="/students">
                <Button type="primary">Manage students</Button>
              </Link>
            )}
          </Space>
        </Col>
      </Row>

      {error && <Alert type="error" showIcon message={error} />}

      <Alert
        type="info"
        showIcon
        message="Official organization showcase database"
        description="This MongoDB is maintained for classroom demos. Public self-registration is disabled; use Sync/Reset (admin) to keep data clean."
      />

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
