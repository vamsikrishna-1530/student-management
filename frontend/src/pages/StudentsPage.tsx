import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  App,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';
import StudentFormModal, {
  type StudentFormValues,
} from '../components/students/StudentFormModal';
import type { Course, Student } from '../types';
import { getErrorMessage } from '../utils/errorMessage';

const statusColor: Record<string, string> = {
  active: 'green',
  inactive: 'default',
  graduated: 'blue',
  suspended: 'red',
};

/**
 * Students page = data loading + table + open modal.
 * Form UI lives in StudentFormModal so this file stays easy to read.
 */
const StudentsPage = () => {
  const { user } = useAuth();
  const { message, modal } = App.useApp();
  const isAdmin = user?.role === 'admin';

  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const [list, courseList] = await Promise.all([
        studentService.list({ search, status, limit: 50 }),
        courseService.list(),
      ]);
      setStudents(list.students);
      setCourses(courseList);
    } catch (err) {
      message.error(getErrorMessage(err, 'Failed to load students'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (student: Student) => {
    setEditing(student);
    setModalOpen(true);
  };

  const handleSave = async (values: StudentFormValues) => {
    setSaving(true);
    try {
      if (editing) {
        await studentService.update(editing._id, values);
        message.success('Student updated');
      } else {
        await studentService.create(values);
        message.success('Student created');
      }
      setModalOpen(false);
      await loadStudents();
    } catch (err) {
      message.error(getErrorMessage(err, 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (student: Student) => {
    modal.confirm({
      title: 'Delete this student?',
      content: 'This also deletes their login account.',
      okType: 'danger',
      onOk: async () => {
        try {
          await studentService.remove(student._id);
          message.success('Student deleted');
          await loadStudents();
        } catch (err) {
          message.error(getErrorMessage(err, 'Delete failed'));
        }
      },
    });
  };

  const columns: ColumnsType<Student> = [
    {
      title: 'Name',
      key: 'name',
      render: (_, row) => (
        <div>
          <Typography.Text strong>{row.user?.name}</Typography.Text>
          <div>
            <Typography.Text type="secondary">{row.user?.email}</Typography.Text>
          </div>
        </div>
      ),
    },
    { title: 'Roll', dataIndex: 'rollNumber' },
    { title: 'Department', dataIndex: 'department' },
    {
      title: 'Year / Sem',
      key: 'yearSem',
      render: (_, row) => `Y${row.year} / S${row.semester}`,
    },
    {
      title: 'GPA',
      dataIndex: 'gpa',
      render: (value) => value ?? '—',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: string) => <Tag color={statusColor[value] || 'default'}>{value}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Space wrap>
          <Button size="small" onClick={() => openEdit(row)}>
            Edit
          </Button>
          {isAdmin && (
            <Button size="small" danger onClick={() => handleDelete(row)}>
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            Students
          </Typography.Title>
          <Typography.Text type="secondary">
            Create, update, search, and manage student records.
          </Typography.Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add student
          </Button>
        </Col>
      </Row>

      <Card className="page-card">
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Search roll / department"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={loadStudents}
            style={{ width: 260 }}
          />
          <Select
            allowClear
            placeholder="All statuses"
            style={{ width: 180 }}
            value={status}
            onChange={setStatus}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'graduated', label: 'Graduated' },
              { value: 'suspended', label: 'Suspended' },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={loadStudents}>
            Search
          </Button>
        </Space>

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={students}
          scroll={{ x: true }}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <StudentFormModal
        open={modalOpen}
        loading={saving}
        editing={editing}
        courses={courses}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
    </Space>
  );
};

export default StudentsPage;
