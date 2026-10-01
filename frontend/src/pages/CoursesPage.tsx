import { useEffect, useState } from 'react';
import { Button, Card, Col, Input, Row, Space, Typography, App } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseService';
import CourseCard from '../components/courses/CourseCard';
import CourseFormModal, {
  type CourseFormValues,
} from '../components/courses/CourseFormModal';
import type { Course } from '../types';
import { getErrorMessage } from '../utils/errorMessage';

/** Courses page = list + open modal. Form UI lives in CourseFormModal. */
const CoursesPage = () => {
  const { user } = useAuth();
  const { message, modal } = App.useApp();
  const canManage = user?.role === 'admin' || user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      setCourses(await courseService.list(search || undefined));
    } catch (err) {
      message.error(getErrorMessage(err, 'Failed to load courses'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (values: CourseFormValues) => {
    setSaving(true);
    try {
      if (editing) {
        await courseService.update(editing._id, {
          name: values.name,
          description: values.description,
          credits: values.credits,
        });
        message.success('Course updated');
      } else {
        await courseService.create({
          name: values.name,
          code: values.code || '',
          description: values.description,
          credits: values.credits,
        });
        message.success('Course created');
      }
      setModalOpen(false);
      await loadCourses();
    } catch (err) {
      message.error(getErrorMessage(err, 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (course: Course) => {
    modal.confirm({
      title: 'Deactivate this course?',
      okType: 'danger',
      onOk: async () => {
        try {
          await courseService.remove(course._id);
          message.success('Course removed');
          await loadCourses();
        } catch (err) {
          message.error(getErrorMessage(err, 'Delete failed'));
        }
      },
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            Courses
          </Typography.Title>
          <Typography.Text type="secondary">
            Browse the catalog and manage offerings.
          </Typography.Text>
        </Col>
        {canManage && (
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              Add course
            </Button>
          </Col>
        )}
      </Row>

      <Card className="page-card" loading={loading}>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Search courses"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={loadCourses}
            style={{ width: 280 }}
          />
          <Button icon={<ReloadOutlined />} onClick={loadCourses}>
            Search
          </Button>
        </Space>

        <Row gutter={[16, 16]}>
          {courses.map((course) => (
            <Col xs={24} sm={12} lg={8} key={course._id}>
              <CourseCard
                course={course}
                actions={
                  canManage
                    ? [
                        <EditOutlined
                          key="edit"
                          onClick={() => {
                            setEditing(course);
                            setModalOpen(true);
                          }}
                        />,
                        ...(isAdmin
                          ? [
                              <DeleteOutlined
                                key="delete"
                                onClick={() => handleDelete(course)}
                              />,
                            ]
                          : []),
                      ]
                    : undefined
                }
              />
            </Col>
          ))}
          {!loading && courses.length === 0 && (
            <Col span={24}>
              <Typography.Text type="secondary">No courses found.</Typography.Text>
            </Col>
          )}
        </Row>
      </Card>

      <CourseFormModal
        open={modalOpen}
        loading={saving}
        editing={editing}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
    </Space>
  );
};

export default CoursesPage;
