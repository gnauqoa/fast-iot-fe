import { LoginPage } from './login';

export const Login = () => {
  return (
    <LoginPage
      title="Fast IoT"
      formProps={{
        initialValues: { email: 'admin@example.com', password: 'secret' },
      }}
    />
  );
};
