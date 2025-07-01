import { Authenticated, Refine } from '@refinedev/core';
import { RefineKbarProvider } from '@refinedev/kbar';
import {
  ThemedLayoutV2,
  ErrorComponent,
  notificationProvider,
  ThemedSiderV2,
} from '@refinedev/antd';
import dataProvider from '@refinedev/nestjsx-crud';
import { NavigateToResource, CatchAllNavigate } from '@refinedev/react-router';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import '@refinedev/antd/dist/reset.css';
import { Login } from '@/pages/login';
import { ColorModeContextProvider } from '@/contexts/color-mode';
import { authProvider } from '@/providers/authProvider';
import { accessControlProvider } from '@/providers/accessControlProvider';
import routerBindings from '@refinedev/react-router';
import { Header } from '@/components';
import { UserEdit, UserList } from '@/pages/users';
import { API_URL } from '@/constants';
import { axiosInstance } from '@/utility/axios';
import { DeviceShow } from '@/pages/devices';
import { DeviceMap } from '@/pages/devices/map';
import { DeviceList } from '@/pages/devices/list';
import { Icon } from '@iconify/react';
import { TemplateEdit, TemplateList } from '@/pages/templates';
import { ReactFlowProvider } from '@xyflow/react';
import { NotificationList } from './pages/notifications/list';
import { NotificationIcon } from './components/notifications';
import { SocketProvider } from './providers/socketProvider';
import { ProfilePage } from './pages/profile';
import { StatusList } from './pages/statuses';
// Redux imports
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import AppTitle from './components/title';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={{ locale: 'vi' }}>
        <ReactFlowProvider>
          <BrowserRouter>
            <RefineKbarProvider>
              <ColorModeContextProvider>
                <SocketProvider>
                  <Refine
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
                          icon: (
                            <Icon
                              icon="bitcoin-icons:node-hardware-filled"
                              width="16"
                              height="16"
                            />
                          ),
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
                      {
                        name: 'statuses',
                        list: '/statuses',
                        meta: {
                          canDelete: false,
                          label: 'User status',
                          icon: <Icon icon="tabler:status-change" width="16" height="16" />,
                        },
                      },
                      {
                        name: 'notifications',
                        list: '/notifications',
                        meta: {
                          canDelete: true,
                          label: 'Notifications',
                          icon: <NotificationIcon />,
                        },
                      },
                      {
                        name: 'profile',
                        list: '/profile',
                        meta: {
                          canDelete: false,
                          icon: <UserOutlined />,
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
                              Title={({ collapsed }) => <AppTitle collapsed={collapsed} />}
                              Header={() => <Header sticky />}
                              Sider={props => <ThemedSiderV2 {...props} fixed />}
                            >
                              <Outlet />
                            </ThemedLayoutV2>
                          </Authenticated>
                        }
                      >
                        <Route path="/profile">
                          <Route index element={<ProfilePage />} />
                        </Route>
                        <Route path="/" element={<Navigate to={'/devices'} />} />
                        <Route path="/devices">
                          <Route index element={<DeviceList />} />
                          <Route path=":id" element={<DeviceShow />} />
                        </Route>
                        <Route path="/templates">
                          <Route index element={<TemplateList />} />
                          <Route path="edit/:id" element={<TemplateEdit />} />
                        </Route>
                        <Route path="/devices-map" element={<DeviceMap />} />
                        <Route path="/users">
                          <Route index element={<UserList />} />
                          <Route path="edit/:id" element={<UserEdit />} />
                        </Route>
                        <Route path="/statuses" element={<StatusList />} />
                        <Route path="/notifications" element={<NotificationList />} />
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
                </SocketProvider>
              </ColorModeContextProvider>
            </RefineKbarProvider>
          </BrowserRouter>{' '}
        </ReactFlowProvider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
