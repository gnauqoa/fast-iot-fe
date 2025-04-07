import { Authenticated, Refine } from '@refinedev/core';
import { RefineKbarProvider } from '@refinedev/kbar';
import {
  ThemedLayoutV2,
  ErrorComponent,
  notificationProvider,
  ThemedTitleV2,
  ThemedSiderV2,
} from '@refinedev/antd';
import dataProvider from '@refinedev/nestjsx-crud';
import { NavigateToResource, CatchAllNavigate } from '@refinedev/react-router';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router';
import { TeamOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import '@refinedev/antd/dist/reset.css';
import { Login } from '@/pages/login';
import { ColorModeContextProvider } from '@/contexts/color-mode';
import { authProvider } from '@/providers/authProvider';
import { accessControlProvider } from '@/providers/accessControlProvider';
import routerBindings from '@refinedev/react-router';
import AppLogo from '@/components/app-logo';
import { Header } from '@/components';
import { UserEdit, UserList } from '@/pages/users';
import { API_URL } from '@/constants';
import { axiosInstance } from '@/utility/axios';
import { DeviceShow } from '@/pages/devices';
import { DeviceMap } from '@/pages/devices/map';
import { DeviceList } from '@/pages/devices/list';
import { websocketProvider } from '@/providers/liveProvider';
import { Icon } from '@iconify/react';
import { TemplateList, TemplateShow } from '@/pages/templates';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={{ locale: 'vi' }}>
      <BrowserRouter>
        <RefineKbarProvider>
          <ColorModeContextProvider>
            <Refine
              liveProvider={websocketProvider}
              dataProvider={dataProvider(API_URL, axiosInstance)}
              routerProvider={routerBindings}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider}
              notificationProvider={notificationProvider}
              options={{
                disableTelemetry: true,
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
              resources={[
                {
                  name: 'devices',
                  list: '/devices',
                  edit: '/devices/edit/:id',
                  show: '/devices/:id',
                  meta: {
                    canDelete: true,
                    icon: <Icon icon="ph:motorcycle-duotone" width="16" height="16" />,
                  },
                },
                {
                  name: 'templates',
                  list: '/templates',
                  edit: '/templates/edit/:id',
                  show: '/templates/:id',
                  meta: {
                    canDelete: true,
                    icon: <Icon icon="tabler:template" width="16" height="16" />,
                  },
                },
                {
                  name: 'devices-map',
                  list: '/devices-map',
                  meta: {
                    canDelete: false,
                    icon: <Icon icon="mdi:map-marker" width="16" height="16" />,
                  },
                },
                {
                  name: 'users',
                  list: '/users',
                  create: '/users/create',
                  edit: '/users/edit/:id',
                  show: '/users/:id',
                  meta: {
                    canDelete: true,
                    icon: <TeamOutlined style={{ fontSize: '16px' }} />,
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="autheticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2
                        Title={({ collapsed }) => (
                          <ThemedTitleV2
                            collapsed={collapsed}
                            icon={collapsed ? <AppLogo /> : <AppLogo />}
                            text="Admin"
                          />
                        )}
                        Header={() => <Header sticky />}
                        Sider={props => <ThemedSiderV2 {...props} fixed />}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="/" element={<Navigate to={'/devices'} />} />
                  <Route path="/devices">
                    <Route index element={<DeviceList />} />
                    <Route path=":id" element={<DeviceShow />} />
                  </Route>
                  <Route path="/templates">
                    <Route index element={<TemplateList />} />
                    <Route path=":id" element={<TemplateShow />} />
                  </Route>
                  <Route path="/devices-map" element={<DeviceMap />} />
                  <Route path="/users">
                    <Route index element={<UserList />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>
            </Refine>
          </ColorModeContextProvider>
        </RefineKbarProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
