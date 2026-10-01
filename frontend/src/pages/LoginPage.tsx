import { useState } from 'react';
import { Button, Form, Input, Typography, Alert, App } from 'antd';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/auth/AuthShell';
import { getErrorMessage } from '../utils/errorMessage';

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" replace />;

  const onFinish = async (values: LoginForm) => {
    setError('');
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Welcome back');
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Manage every student journey in one place."
      subtitle="Track enrollments, courses, and academic status with a clean MERN workflow."
    >
      <div>
        <Typography.Title level={3} style={{ marginBottom: 4 }}>
          Welcome back
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Sign in to continue to your campus dashboard.
        </Typography.Paragraph>
      </div>

      <Form<LoginForm>
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ email: 'admin@sms.edu', password: 'Admin@123' }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input.Password size="large" />
        </Form.Item>

        {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
          Sign in
        </Button>
      </Form>

      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        New here? <Link to="/register">Create an account</Link>
      </Typography.Paragraph>

      <Alert
        type="info"
        showIcon
        message="Demo admin"
        description={
          <span>
            <code>admin@sms.edu</code> / <code>Admin@123</code>
          </span>
        }
      />
    </AuthShell>
  );
};

export default LoginPage;
