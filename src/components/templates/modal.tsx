import { useForm, useSelect } from '@refinedev/antd';
import { Modal, Button, Form, Input, Select } from 'antd';
import { ITemplate } from '@/interfaces/template';
import { useEffect } from 'react';
import { IUser } from '@/interfaces/user';

interface TemplateModalProps {
  template?: ITemplate;
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const TemplateModal = ({ template, open, onCancel, onSuccess }: TemplateModalProps) => {
  const isEditMode = !!template;

  const { formProps, saveButtonProps, onFinish } = useForm<ITemplate>({
    resource: 'templates',
    action: isEditMode ? 'edit' : 'create',
    id: isEditMode ? template?.id : undefined,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any) => {
    const { userId, ...rest } = values;

    onFinish({
      ...rest,
      user: query?.data?.data.find((user: IUser) => user.id === userId),
      userId: userId,
    });
  };

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        return formProps.form?.setFieldsValue({
          name: template.name,
          description: template.description,
        });
      }
      formProps.form?.setFieldsValue({
        name: '',
        description: '',
      });
    }
  }, [open, isEditMode, formProps.form]);

  return (
    <Modal
      title={isEditMode ? 'Edit Template' : 'Create Template'}
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
          label="Template Name"
          name="name"
          rules={[{ required: true, message: 'Template name is required' }]}
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

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
