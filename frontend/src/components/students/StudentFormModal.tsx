import { Modal, Form, Input, InputNumber, Select } from 'antd';
import type { Course, Student } from '../../types';

export type StudentFormValues = {
  name: string;
  email?: string;
  password?: string;
  rollNumber: string;
  department: string;
  year: number;
  semester: number;
  phone?: string;
  address?: string;
  gpa?: number;
  status?: string;
  courses?: string[];
};

type StudentFormModalProps = {
  open: boolean;
  loading?: boolean;
  editing: Student | null;
  courses: Course[];
  onCancel: () => void;
  onSubmit: (values: StudentFormValues) => Promise<void>;
};

/**
 * Add/Edit Student dialog.
 * Ant Design Form handles validation; the page only saves the values.
 */
const StudentFormModal = ({
  open,
  loading,
  editing,
  courses,
  onCancel,
  onSubmit,
}: StudentFormModalProps) => {
  const [form] = Form.useForm<StudentFormValues>();
  const isEdit = Boolean(editing);

  return (
    <Modal
      title={isEdit ? 'Edit student' : 'Add student'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={isEdit ? 'Save changes' : 'Create student'}
      confirmLoading={loading}
      destroyOnHidden
      width={720}
      styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      afterOpenChange={(visible) => {
        if (!visible) {
          form.resetFields();
          return;
        }
        if (editing) {
          form.setFieldsValue({
            name: editing.user?.name,
            email: editing.user?.email,
            rollNumber: editing.rollNumber,
            department: editing.department,
            year: editing.year,
            semester: editing.semester,
            phone: editing.phone,
            address: editing.address,
            gpa: editing.gpa,
            status: editing.status,
            courses: editing.courses?.map((c) => c._id) || [],
          });
        } else {
          form.setFieldsValue({
            department: 'Computer Science',
            year: 1,
            semester: 1,
            password: 'Student@123',
            status: 'active',
            courses: [],
          });
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark="optional"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>

        {!isEdit && (
          <>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input placeholder="student@college.edu" />
            </Form.Item>
            <Form.Item label="Temp password" name="password">
              <Input.Password placeholder="Temporary password" />
            </Form.Item>
          </>
        )}

        <Form.Item
          label="Roll number"
          name="rollNumber"
          rules={[{ required: true, message: 'Roll number is required' }]}
        >
          <Input disabled={isEdit} placeholder="CSE2024001" />
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: 'Department is required' }]}
        >
          <Input placeholder="Computer Science" />
        </Form.Item>

        <Form.Item
          label="Year"
          name="year"
          rules={[{ required: true, message: 'Year is required' }]}
        >
          <InputNumber min={1} max={5} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Semester"
          name="semester"
          rules={[{ required: true, message: 'Semester is required' }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input placeholder="9876543210" />
        </Form.Item>

        <Form.Item label="GPA" name="gpa">
          <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
        </Form.Item>

        {isEdit && (
          <Form.Item label="Status" name="status">
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'graduated', label: 'Graduated' },
                { value: 'suspended', label: 'Suspended' },
              ]}
            />
          </Form.Item>
        )}

        <Form.Item label="Address" name="address">
          <Input.TextArea rows={2} placeholder="Optional address" />
        </Form.Item>

        <Form.Item
          label="Courses"
          name="courses"
          extra="Select one or more courses for this student"
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Choose courses"
            options={courses.map((c) => ({
              value: c._id,
              label: `${c.code} — ${c.name}`,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentFormModal;
