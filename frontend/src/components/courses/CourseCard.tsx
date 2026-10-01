import type { ReactNode } from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import type { Course } from '../../types';

type CourseCardProps = {
  course: Course;
  actions?: ReactNode[];
};
/** One course tile used on Dashboard and Courses pages. */
const CourseCard = ({ course, actions }: CourseCardProps) => {
  return (
    <Card className="course-card page-card" actions={actions}>
      <Space direction="vertical" size={6} style={{ width: '100%' }}>
        <Tag color="orange">{course.code}</Tag>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {course.name}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {course.description || 'No description provided.'}
        </Typography.Paragraph>
        <Typography.Text strong>{course.credits} credits</Typography.Text>
      </Space>
    </Card>
  );
};

export default CourseCard;
