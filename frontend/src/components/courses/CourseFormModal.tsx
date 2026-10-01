import { Modal, Form, Input, InputNumber } from 'antd';
import type { Course } from '../../types';

export type CourseFormValues = {
  name: string;
  code?: string;
  description?: string;
  credits: number;
};

type CourseFormModalProps = {
  open: boolean;
  loading?: boolean;
  editing: Course | null;
  onCancel: () => void;
  onSubmit: (values: CourseFormValues) => Promise<void>;
};

/** Add/Edit Course dialog — same Form pattern as StudentFormModal. */
const CourseFormModal = ({
  open,
  loading,
  editing,
  onCancel,
  onSubmit,
}: CourseFormModalProps) => {
  const [form] = Form.useForm<CourseFormValues>();
  const isEdit = Boolean(editing);

  return (
    <Modal
      title={isEdit ? 'Edit course' : 'Add course'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={isEdit ? 'Save changes' : 'Create course'}
      confirmLoading={loading}
      destroyOnHidden
      styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      afterOpenChange={(visible) => {
        if (!visible) {
          form.resetFields();
          return;
        }
        if (editing) {
          form.setFieldsValue({
            name: editing.name,
            code: editing.code,
            description: editing.description,
            credits: editing.credits,
          });
        } else {
          form.setFieldsValue({ credits: 3 });
        }
      }}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Course name is required' }]}
        >
          <Input placeholder="Data Structures" />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Course code is required' }]}
          >
            <Input placeholder="CSE201" />
          </Form.Item>
        )}

        <Form.Item
          label="Credits"
          name="credits"
          rules={[{ required: true, message: 'Credits are required' }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="What students will learn" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseFormModal;
