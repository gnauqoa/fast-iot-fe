import type { RefineThemedLayoutV2HeaderProps } from '@refinedev/antd';
import { useGetIdentity, useLogout } from '@refinedev/core';
import { Layout as AntdLayout, Space, Typography, theme, Avatar, Dropdown, Menu } from 'antd';
import React from 'react';
import { IUser } from 'interfaces/user';
import { useNavigate } from 'react-router';

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky }) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '0px 24px',
    height: '64px',
  };

  if (sticky) {
    headerStyles.position = 'sticky';
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  const menu = (
    <Menu
      items={[
        {
          key: 'profile',
          label: 'My Profile',
          onClick: () => navigate('/profile'),
        },
        {
          key: 'logout',
          label: 'Logout',
          onClick: () => logout(),
        },
      ]}
    />
  );

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Dropdown overlay={menu} trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar src={user?.avatar} style={{ backgroundColor: '#1890ff' }}>
              {user?.fullName?.[0] ?? 'U'}
            </Avatar>
            <Text strong>{user?.fullName}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntdLayout.Header>
  );
};
