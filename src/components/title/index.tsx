import { Typography, theme } from 'antd';
import AppLogo from '../app-logo';

const { Title } = Typography;
const { useToken } = theme;

const AppTitle = ({ collapsed }: { collapsed: boolean }) => {
  const { token } = useToken();
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="w-[2.5rem] h-[2.5rem]">
        <AppLogo />
      </div>
      {!collapsed && (
        <Title level={4} style={{ color: token.colorWhite, margin: 0 }}>
          Fast IoT
        </Title>
      )}
    </div>
  );
};

export default AppTitle;
