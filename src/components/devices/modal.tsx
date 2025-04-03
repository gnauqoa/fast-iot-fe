import { useForm, useSelect } from "@refinedev/antd";
import { Modal, Button, Form, Input, Select } from "antd";
import { IDevice } from "../../interfaces/device";
import { IUser } from "../../interfaces/user";
import { useEffect } from "react";

interface DeviceModalProps {
  device?: IDevice;
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const DeviceModal = ({
  device,
  open,
  onCancel,
  onSuccess,
}: DeviceModalProps) => {
  const isEditMode = !!device;

  const { formProps, saveButtonProps, onFinish } = useForm<IDevice>({
    resource: "devices",
    action: isEditMode ? "edit" : "create",
    id: isEditMode ? device?.id : undefined,
    onMutationSuccess: () => {
      if (onSuccess) onSuccess();
      onCancel();
    },
  });

  const { selectProps, query } = useSelect<IUser>({
    resource: "users",
    optionLabel: "fullName",
    optionValue: "id",
    pagination: { pageSize: 100 },
    filters: [],
  });

  const onSubmit = (values: any) => {
    const { user_id, ...rest } = values;

    onFinish({
      ...rest,
      user: query?.data?.data.find((user: IUser) => user.id === user_id),
      user_id: user_id,
    });
  };

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        return formProps.form?.setFieldsValue({
          name: device.name,
          user_id: device.user_id,
        });
      }
      formProps.form?.setFieldsValue({
        name: "",
        user_id: undefined,
      });
    }
  }, [open, isEditMode, formProps.form]);

  return (
    <Modal
      title={isEditMode ? "Edit Device" : "Create Device"}
      open={open}
      onCancel={onCancel}
      onClose={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" {...saveButtonProps}>
          {isEditMode ? "Update" : "Create"}
        </Button>,
      ]}
    >
      {
        <Form {...formProps} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Device Name"
            name="name"
            rules={[{ required: true, message: "Device name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="user_id" label="User">
            <Select
              {...selectProps}
              style={{ width: "100%" }}
              placeholder="Select a user"
              allowClear
            />
          </Form.Item>
        </Form>
      }
    </Modal>
  );
};
