import { Edit, useForm } from '@refinedev/antd';
import { Form, Input, Select, Tag, Spin } from 'antd';
import { IUser, UserRole } from '@/interfaces/user';
import { useEffect } from 'react';
import { useStatusData } from '@/hooks/use-status-data';
import { stringToHexColor } from '@/utility/color';

export const UserEdit = () => {
  const { statuses, loading } = useStatusData();
  const { formProps, saveButtonProps, query, onFinish, form } = useForm<IUser>({
    mutationMode: 'optimistic',
    redirect: false,
  });

  const userData = query?.data?.data;

  const roleColors: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'gold',
    [UserRole.USER]: 'blue',
  };

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role?.name,
        status: userData.status?.name,
        createdAt: userData.createdAt,
      });
    }
  }, [userData, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any) => {
    onFinish({
      ...values,
      role: { id: values.role === UserRole.USER ? 2 : 1, name: values.role },
      status: { id: values.status, name: values.status },
    });
  };

  if (loading) return <Spin />;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Full Name is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Role is required' }]}
        >
          <Select
            options={Object.values(UserRole).map(role => ({
              label: <Tag color={roleColors[role]}>{role}</Tag>,
              value: role,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Status is required' }]}
        >
          <Select
            options={statuses?.map(status => ({
              label: <Tag color={stringToHexColor(status.name)}>{status.name}</Tag>,
              value: status.id,
            }))}
          />
        </Form.Item>

        <Form.Item label="Created At" name="createdAt">
          <Input disabled />
        </Form.Item>
      </Form>
    </Edit>
  );
};
