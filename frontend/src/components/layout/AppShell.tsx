import { Layout, Menu, Typography, Button, theme } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Sider, Content } = Layout;

/**
 * App shell: left navigation + main content area.
 * Pages only render inside <Outlet /> — they do not redraw the sidebar.
 */
const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const canManage = user?.role === 'admin' || user?.role === 'teacher';

  const selectedKey = location.pathname.startsWith('/students')
    ? '/students'
    : location.pathname.startsWith('/courses')
      ? '/courses'
      : '/';

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    ...(canManage
      ? [{ key: '/students', icon: <TeamOutlined />, label: 'Students' }]
      : []),
    { key: '/courses', icon: <BookOutlined />, label: 'Courses' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        width={240}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '1.25rem 1rem 0.5rem' }}>
          <Typography.Title
            level={3}
            className="brand-title"
            style={{ color: '#fffcf7', margin: 0 }}
          >
            CampusLedger
          </Typography.Title>
          <Typography.Text style={{ color: 'rgba(255,252,247,0.75)' }}>
            Student Management
          </Typography.Text>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, borderInlineEnd: 0 }}
        />

        <div style={{ padding: '1rem' }}>
          <div
            style={{
              background: 'rgba(255,252,247,0.1)',
              borderRadius: 12,
              padding: '0.85rem',
              marginBottom: 12,
            }}
          >
            <Typography.Text strong style={{ color: '#fffcf7', display: 'block' }}>
              {user?.name}
            </Typography.Text>
            <Typography.Text
              style={{ color: 'rgba(255,252,247,0.75)', textTransform: 'capitalize' }}
            >
              {user?.role}
            </Typography.Text>
          </div>
          <Button
            block
            icon={<LogoutOutlined />}
            onClick={logout}
            style={{
              color: '#fffcf7',
              borderColor: 'rgba(255,252,247,0.3)',
              background: 'transparent',
            }}
          >
            Logout
          </Button>
        </div>
      </Sider>

      <Layout>
        <Content style={{ padding: 24 }}>
          <Typography.Text
            style={{ color: token.colorTextSecondary, display: 'block', marginBottom: 16 }}
          >
            Welcome back, {user?.name}
          </Typography.Text>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppShell;
