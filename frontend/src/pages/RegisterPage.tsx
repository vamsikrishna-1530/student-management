import { useState } from 'react';
import { Button, Form, Input, Typography, Alert, App } from 'antd';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/auth/AuthShell';
import { getErrorMessage } from '../utils/errorMessage';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const { register, token } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" replace />;

  const onFinish = async (values: RegisterForm) => {
    setError('');
    setLoading(true);
    try {
      await register(values.name, values.email, values.password);
      message.success('Account created');
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Join your campus workspace."
      subtitle="Create a student account and explore the shared course catalog."
    >
      <div>
        <Typography.Title level={3} style={{ marginBottom: 4 }}>
          Create account
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Self-registration creates a student role.
        </Typography.Paragraph>
      </div>

      <Form<RegisterForm> layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Full name"
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input size="large" />
        </Form.Item>
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
          rules={[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'At least 6 characters' },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
          Register
        </Button>
      </Form>

      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        Already registered? <Link to="/login">Sign in</Link>
      </Typography.Paragraph>
    </AuthShell>
  );
};

export default RegisterPage;
