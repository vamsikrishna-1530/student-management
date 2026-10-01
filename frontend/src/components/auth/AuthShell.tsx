import { Card, Typography, Space } from 'antd';
import type { ReactNode } from 'react';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

/** Shared login/register layout: brand hero + centered form card. */
const AuthShell = ({ title, subtitle, children }: AuthShellProps) => {
  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <div>
          <Typography.Title
            level={2}
            className="brand-title"
            style={{ color: '#fffcf7', marginBottom: 24 }}
          >
            CampusLedger
          </Typography.Title>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </section>

      <section className="auth-panel">
        <Card className="page-card" style={{ width: 'min(420px, 100%)' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {children}
          </Space>
        </Card>
      </section>
    </div>
  );
};

export default AuthShell;
