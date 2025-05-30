import { useForm, useSelect } from '@refinedev/antd';
import { Modal, Button, Form, Input, Select } from 'antd';
import { IDevice } from '../../interfaces/device';
import { IUser } from '../../interfaces/user';
import { useEffect } from 'react';
import { ITemplate } from '@/interfaces/template';

interface DeviceModalProps {
  device?: IDevice;
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const DeviceModal = ({ device, open, onCancel, onSuccess }: DeviceModalProps) => {
  const isEditMode = !!device;

  const { formProps, saveButtonProps, onFinish } = useForm<IDevice>({
    resource: 'devices',
    action: isEditMode ? 'edit' : 'create',
    id: isEditMode ? device?.id : undefined,
    onMutationSuccess: () => {
      if (onSuccess) onSuccess();
      onCancel();
    },
  });

  const { selectProps, query } = useSelect<IUser>({
    resource: 'users',
    optionLabel: 'fullName',
    optionValue: 'id',
    pagination: { pageSize: 100 },
    filters: [],
  });

  const { selectProps: templateSelectProps, query: templateQuery } = useSelect<ITemplate>({
    resource: 'templates',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: { pageSize: 100 },
    filters: [],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any) => {
    const { userId, templateId, ...rest } = values;

    onFinish({
      ...rest,
      user: query?.data?.data.find((user: IUser) => user.id === userId),
      userId: userId,
      template: templateQuery?.data?.data.find((template: ITemplate) => template.id === templateId),
      templateId: templateId,
    });
  };

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        return formProps.form?.setFieldsValue({
          name: device.name,
          userId: device.userId,
        });
      }
      formProps.form?.setFieldsValue({
        name: '',
        userId: undefined,
      });
    }
  }, [open, isEditMode, formProps.form, device?.name, device?.userId]);

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

          <Form.Item name="userId" label="User">
            <Select
              {...selectProps}
              style={{ width: '100%' }}
              placeholder="Select a user"
              allowClear
            />
          </Form.Item>

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
