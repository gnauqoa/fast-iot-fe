import { useForm } from '@refinedev/antd';
import { Modal, Button, Form, Input } from 'antd';
import { IStatus } from '@/interfaces/user';
import { useEffect } from 'react';

interface StatusModalProps {
  status?: IStatus;
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const StatusModal = ({ status, open, onCancel, onSuccess }: StatusModalProps) => {
  const isEditMode = !!status;

  const { formProps, saveButtonProps, onFinish } = useForm<IStatus>({
    resource: 'statuses',
    action: isEditMode ? 'edit' : 'create',
    id: isEditMode ? status?.id : undefined,
    onMutationSuccess: () => {
      if (onSuccess) onSuccess();
      onCancel();
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any) => {
    onFinish({
      ...values,
    });
  };

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        return formProps.form?.setFieldsValue({
          name: status.name,
        });
      }
      formProps.form?.setFieldsValue({
        name: '',
      });
    }
  }, [open, isEditMode, formProps.form, status?.name]);

  return (
    <Modal
      title={isEditMode ? 'Edit Status' : 'Create Status'}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" {...saveButtonProps}>
          {isEditMode ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form {...formProps} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Status Name"
          name="name"
          rules={[
            { required: true, message: 'Status name is required' },
            { min: 2, message: 'Status name must be at least 2 characters' },
            { max: 50, message: 'Status name must not exceed 50 characters' },
            {
              pattern: /^[a-zA-Z0-9\s\-_]+$/,
              message:
                'Status name can only contain letters, numbers, spaces, hyphens, and underscores',
            },
          ]}
        >
          <Input
            placeholder="Enter status name (e.g., Active, Pending, Completed)"
            showCount
            maxLength={50}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
