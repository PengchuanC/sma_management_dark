import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: "realDark",
  primaryColor: "#1890ff",
  layout: "side",
  contentWidth: "Fluid",
  fixedHeader: true,
  fixSiderbar: true,
  logo: '../icons/logo.svg',
  title: "财富投管系统",
  pwa: false,
  iconfontUrl: "",
  menu: {
    "locale": true
  },
  headerHeight: 48,
};

export default Settings;
