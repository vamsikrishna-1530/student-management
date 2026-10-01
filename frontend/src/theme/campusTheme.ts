import type { ThemeConfig } from 'antd';

// CampusLedger brand tokens shared by every Ant Design component.
export const campusTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0b6e75',
    colorInfo: '#0b6e75',
    colorSuccess: '#1b7a4e',
    colorWarning: '#c45c26',
    colorError: '#b42318',
    colorTextBase: '#132a2e',
    colorBgBase: '#fffcf7',
    borderRadius: 10,
    fontFamily: "'Outfit', system-ui, sans-serif",
    controlHeight: 40,
  },
  components: {
    Layout: {
      siderBg: '#084a4f',
      triggerBg: '#0b6e75',
    },
    Menu: {
      darkItemBg: '#084a4f',
      darkSubMenuItemBg: '#084a4f',
      darkItemSelectedBg: 'rgba(255,252,247,0.14)',
      darkItemHoverBg: 'rgba(255,252,247,0.1)',
    },
    Button: {
      primaryShadow: 'none',
    },
  },
};
