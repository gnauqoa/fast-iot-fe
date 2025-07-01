import React, { useEffect, useState } from 'react';
import { useGetIdentity, useUpdate, useCustomMutation } from '@refinedev/core';
import {
  Card,
  Descriptions,
  Typography,
  Tag,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  Upload,
  UploadProps,
  message,
  Spin,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { IUser, UserRole } from '@/interfaces/user';
import { PenLine } from 'lucide-react';
import ChangePasswordModal from '@/components/change-password-modal';
import { useStatusData } from '@/hooks/use-status-data';
import { stringToHexColor } from '@/utility/color';

const { Title } = Typography;
const { Dragger } = Upload;

const roleColors: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'gold',
  [UserRole.USER]: 'blue',
};

export const ProfilePage: React.FC = () => {
  const { statuses, loading } = useStatusData();
  const { data: identity, isLoading } = useGetIdentity<IUser>();
  const [user, setUser] = useState<IUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (identity) setUser(identity);
  }, [identity]);

  const isAdmin = user?.role?.name === UserRole.ADMIN;

  const { mutate: updateUser, isLoading: isUpdating } = useUpdate<IUser>();
  const { mutate: updateAvatar, isLoading: isAvatarUpdating } = useCustomMutation();

  const handleEditInfo = async () => {
    try {
      const values = await form.validateFields();

      updateUser(
        {
          resource: 'users',
          id: user?.id,
          values: {
            ...values,
            ...(isAdmin && {
              role: { id: values.role === UserRole.USER ? 2 : 1, name: values.role },
              status: { id: values.status, name: values.status },
            }),
          },
        },
        {
          onSuccess: response => {
            setUser(response.data);
            setIsEditModalOpen(false);
            message.success('Update profile successfully!');
          },
        }
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    }
  };

  const handleAvatarUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file as Blob);

    updateAvatar(
      {
        url: '/auth/avatar',
        method: 'patch',
        values: formData,
      },
      {
        onSuccess: response => {
          const updatedUser = {
            ...user,
            avatar: response.data?.avatar || response.data?.url || response.data,
          } as IUser;
          setUser(updatedUser);
          setIsAvatarModalOpen(false);
          message.success('Update avatar successfully!');
          onSuccess?.(response.data, new XMLHttpRequest());
        },
        onError: err => {
          message.error('Update avatar failed!');
          onError?.(new Error('Upload failed'));
        },
      }
    );
  };

  if (isLoading || loading) return <Spin />;
  if (!user) return null;

  return (
    <>
      <Row gutter={24}>
        <Col span={10}>
          <Card className="w-full" style={{ height: '100%' }}>
            <Title style={{ textAlign: 'center' }} level={3}>
              {user.firstName} {user.lastName}
            </Title>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Avatar
                  style={{
                    width: '300px',
                    height: '300px',
                    position: 'relative',
                  }}
                  src={user.avatar}
                />
                <div style={{ position: 'absolute', bottom: '30px', right: '28px' }}>
                  <Button
                    icon={<PenLine size={14} />}
                    style={{ borderRadius: '999px' }}
                    onClick={() => setIsAvatarModalOpen(true)}
                    loading={isAvatarUpdating}
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={14}>
          <Card
            className="w-full"
            extra={
              <Button
                onClick={() => {
                  setIsEditModalOpen(true);
                  form.setFieldsValue({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role?.name,
                    status: user.status?.name,
                  });
                }}
              >
                Edit
              </Button>
            }
          >
            <Title level={3}>Bio & other details</Title>
            <Descriptions column={2}>
              <Descriptions.Item label="First Name">{user.firstName}</Descriptions.Item>
              <Descriptions.Item label="Last Name">{user.lastName}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Password">
                <ChangePasswordModal recordItemId={user.id} />
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={roleColors[user.role?.name]}>{user.role?.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={stringToHexColor(user.status?.name)}>{user.status?.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(user.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Modal Edit Info */}
      <Modal
        open={isEditModalOpen}
        title="Edit Profile"
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleEditInfo}
        confirmLoading={isUpdating}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'First Name is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Last Name is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Select
              disabled={!isAdmin}
              options={Object.values(UserRole).map(role => ({
                label: <Tag color={roleColors[role]}>{role}</Tag>,
                value: role,
              }))}
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              disabled={!isAdmin}
              options={statuses?.map(status => ({
                label: <Tag color={stringToHexColor(status.name)}>{status.name}</Tag>,
                value: status.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Upload Avatar */}
      <Modal
        open={isAvatarModalOpen}
        title="Update avatar"
        onCancel={() => setIsAvatarModalOpen(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: '20px 0' }}>
          <Dragger
            name="avatar"
            customRequest={handleAvatarUpload}
            showUploadList={false}
            accept="image/*"
            maxCount={1}
            style={{
              padding: '40px 20px',
              border: '2px dashed #d9d9d9',
              borderRadius: '8px',
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text" style={{ fontSize: '16px', margin: '16px 0 8px' }}>
              Drag and drop image here or click to select
            </p>
            <p className="ant-upload-hint" style={{ color: '#666' }}>
              Support the following formats: JPG, PNG, GIF. Maximum size: 5MB
            </p>
          </Dragger>
        </div>
      </Modal>
    </>
  );
};
