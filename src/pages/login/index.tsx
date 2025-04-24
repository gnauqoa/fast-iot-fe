import { LoginPage } from './login';

export const Login = () => {
  return (
    <LoginPage
      title="Admin login"
      formProps={{
        initialValues: { email: 'admin@example.com', password: 'secret' },
      }}
    />
  );
};
