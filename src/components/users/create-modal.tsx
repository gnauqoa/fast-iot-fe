import { useState } from 'react';
import { useForm } from '@refinedev/antd';
import { Modal, Button, Form, Input, Select, Tag, Spin } from 'antd';
import { IUser, UserRole } from '@/interfaces/user';
import { useStatusData } from '@/hooks/use-status-data';
import { stringToHexColor } from '@/utility/color';

export const UserCreateModal = () => {
  const { statuses, loading } = useStatusData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { form, formProps, saveButtonProps, onFinish } = useForm<IUser>({
    onMutationSuccess: () => setIsModalOpen(false),
  });

  // Màu sắc của Role và Status
  const roleColors: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'gold',
    [UserRole.USER]: 'blue',
  };

  // Xử lý submit form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any) => {
    onFinish({
      ...values,
      role: values.role === UserRole.USER ? 2 : 1,
      status: statuses?.find(status => status.name === values.status)?.id,
    });
  };

  if (loading) return <Spin />;

  return (
    <>
      {/* Nút mở modal */}
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Create User
      </Button>

      {/* Modal Form */}
      <Modal
        title="Create User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" {...saveButtonProps}>
            Create
          </Button>,
        ]}
      >
        <Form
          {...formProps}
          form={form}
          layout="vertical"
          initialValues={{
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: UserRole.USER,
            status: statuses?.[0]?.id,
          }}
          onFinish={onSubmit}
        >
          {/* Full Name */}
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Full Name is required' }]}
          >
            <Input />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Role */}
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

          {/* Status */}
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
        </Form>
      </Modal>
    </>
  );
};
