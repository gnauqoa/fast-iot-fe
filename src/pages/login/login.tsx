import React, { useContext } from 'react';
import {
  LoginPageProps,
  LoginFormTypes,
  useActiveAuthProvider,
  useLogin,
  useTranslate,
} from '@refinedev/core';
import { containerStyles, layoutStyles, titleStyles } from '@/components/styles/authStyles';
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  CardProps,
  LayoutProps,
  FormProps,
  theme,
} from 'antd';
import { ColorModeContext } from '@/contexts/color-mode';
import AppLogo from '@/components/app-logo';

const { Title } = Typography;
const { useToken } = theme;

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;

export const LoginPage: React.FC<LoginProps> = ({
  contentProps,
  wrapperProps,
  formProps,
  title,
}) => {
  const { token } = useToken();
  const translate = useTranslate();
  const { mode } = useContext(ColorModeContext);

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const pageTitleColor = mode === 'light' ? '#000' : '#fff';

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col xs={22}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <div className="w-[5rem] h-[5rem]">
              <AppLogo />
            </div>
            <Title level={3} style={{ color: token.colorWhite, ...titleStyles }}>
              {title}
            </Title>
          </div>

          <Card
            title={
              <Title level={3} style={{ color: token.colorPrimaryTextHover, ...titleStyles }}>
                Login
              </Title>
            }
            style={{
              ...containerStyles,
              backgroundColor: token.colorBgElevated,
            }}
            {...(contentProps ?? {})}
          >
            <Form<LoginFormTypes>
              layout="vertical"
              onFinish={login}
              requiredMark={false}
              initialValues={{ remember: false }}
              {...formProps}
            >
              <Form.Item
                name="email"
                label={translate('pages.login.fields.email', 'Email')}
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  {
                    type: 'email',
                    message: translate('pages.login.errors.validEmail', 'Email không hợp lệ!'),
                  },
                ]}
              >
                <Input size="large" placeholder="Nhập email của bạn" autoComplete="email" />
              </Form.Item>

              <Form.Item
                name="password"
                label={translate('pages.login.fields.password', 'Mật khẩu')}
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  size="large"
                  autoComplete="current-password"
                  onPressEnter={() => formProps?.onFinish && formProps.onFinish}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" size="large" htmlType="submit" loading={isLoading} block>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};
