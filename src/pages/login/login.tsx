import React, { useContext } from 'react';
import {
  LoginPageProps,
  LoginFormTypes,
  useActiveAuthProvider,
  useLogin,
  useTranslate,
} from '@refinedev/core';
import { ThemedTitle } from '@refinedev/antd';
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
          {title !== false && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '32px',
                fontSize: '32px',
                fontWeight: 700,
                color: pageTitleColor,
              }}
            >
              {title ?? <ThemedTitle collapsed={false} text={title} />}
            </div>
          )}

          <Card
            title={
              <Title level={3} style={{ color: token.colorPrimaryTextHover, ...titleStyles }}>
                Admin
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
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};
