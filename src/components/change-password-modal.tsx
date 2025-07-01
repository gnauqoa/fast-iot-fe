import { IUser, UserRole } from '@/interfaces/user';
import { LockOutlined } from '@ant-design/icons';
import { useCustomMutation, useGetIdentity } from '@refinedev/core';
import { Button, Form, Input, Modal, message } from 'antd';
import { useState } from 'react';

interface ChangePasswordFormValues {
  previousPassword: string;
  password: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  recordItemId?: string | number; // userId
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ recordItemId }) => {
  const { data: identity } = useGetIdentity<IUser>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm<ChangePasswordFormValues>();

  const { mutate, isLoading } = useCustomMutation();

  const handleFinish = async (values: ChangePasswordFormValues) => {
    const { previousPassword, password } = values;
    mutate(
      {
        method: 'patch',
        url: identity?.role?.name === UserRole.ADMIN ? `users/${recordItemId}/password` : `auth/me`,
        values: {
          previousPassword,
          password,
        },
      },
      {
        onSuccess: () => {
          message.success('Password updated successfully');
          setModalOpen(false);
          form.resetFields();
        },
        onError: _error => {
          message.error('Failed to update password');
        },
      }
    );
  };

  return (
    <>
      <Button size="small" icon={<LockOutlined />} onClick={() => setModalOpen(true)} />
      <Modal
        title={`Change Password`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okButtonProps={{ loading: isLoading }}
        afterClose={() => form.resetFields()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {(identity?.role?.name !== UserRole.ADMIN || identity.id === recordItemId) && (
            <Form.Item
              label="Current Password"
              name="previousPassword"
              rules={[{ required: true, message: 'Please enter current password' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            label="New Password"
            name="password"
            rules={[{ required: true, message: 'Please enter new password' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
