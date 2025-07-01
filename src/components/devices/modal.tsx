import { useForm, useSelect } from '@refinedev/antd';
import { Modal, Button, Form, Input, Select, Spin } from 'antd';
import { IDevice } from '../../interfaces/device';
import { IUser, UserRole } from '../../interfaces/user';
import { useEffect, useState, useCallback } from 'react';
import { ITemplate } from '@/interfaces/template';
import { useGetIdentity } from '@refinedev/core';

interface DeviceModalProps {
  device?: IDevice;
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const SelectUser = ({ setUsers }: { setUsers: (users: IUser[]) => void }) => {
  const { selectProps, query } = useSelect<IUser>({
    resource: 'users',
    optionLabel: 'fullName',
    optionValue: 'id',
    pagination: { pageSize: 100 },
    filters: [],
  });

  useEffect(() => {
    if (query?.data?.data) {
      setUsers(query?.data?.data);
    }
  }, [query?.data?.data, setUsers]);

  return (
    <Form.Item name="userId" label="User">
      <Select {...selectProps} style={{ width: '100%' }} placeholder="Select a user" allowClear />
    </Form.Item>
  );
};

export const DeviceModal = ({ device, open, onCancel, onSuccess }: DeviceModalProps) => {
  const isEditMode = !!device;
  const { data: identity, isLoading } = useGetIdentity<IUser>();
  const [users, setUsers] = useState<IUser[]>([]);

  const setUsersCallback = useCallback((users: IUser[]) => {
    setUsers(users);
  }, []);

  const { formProps, saveButtonProps, onFinish } = useForm<IDevice>({
    resource: 'devices',
    action: isEditMode ? 'edit' : 'create',
    id: isEditMode ? device?.id : undefined,
    onMutationSuccess: () => {
      if (onSuccess) onSuccess();
      onCancel();
    },
  });

  const isAdmin = identity?.role?.name === UserRole.ADMIN;
  const { selectProps: templateSelectProps, query: templateQuery } = useSelect<ITemplate>({
    resource: 'templates',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: { pageSize: 100 },
    filters: [],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any) => {
    const { templateId, userId, ...rest } = values;
    console.log({ users, userId });
    onFinish({
      ...rest,
      user: users.find(user => user.id === values.userId),
      userId: values.userId,
      template: templateQuery?.data?.data?.find(
        (template: ITemplate) => template.id === templateId
      ),
      templateId: templateId,
    });
  };

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        return formProps.form?.setFieldsValue({
          name: device.name,
          userId: device.userId,
          templateId: device.template?.id,
        });
      }
      formProps.form?.setFieldsValue({
        name: '',
        userId: isAdmin ? undefined : identity?.id,
        templateId: undefined,
      });
    }
  }, [
    open,
    isEditMode,
    formProps.form,
    device?.name,
    device?.userId,
    device?.template?.id,
    isAdmin,
    identity,
  ]);

  if (isLoading) {
    return <Spin />;
  }

  return (
    <Modal
      title={isEditMode ? 'Edit Device' : 'Create Device'}
      open={open}
      onCancel={onCancel}
      onClose={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" {...saveButtonProps}>
          {isEditMode ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      {
        <Form {...formProps} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Device Name"
            name="name"
            rules={[{ required: true, message: 'Device name is required' }]}
          >
            <Input />
          </Form.Item>

          {isAdmin && <SelectUser setUsers={setUsersCallback} />}

          <Form.Item name="templateId" label="Template">
            <Select
              {...templateSelectProps}
              style={{ width: '100%' }}
              placeholder="Select a template"
              allowClear
            />
          </Form.Item>
        </Form>
      }
    </Modal>
  );
};
