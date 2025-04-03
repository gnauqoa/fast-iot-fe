import { Edit, useForm } from "@refinedev/antd";

import { Form, Input } from "antd";

import type { ICategory } from "../../interfaces";

export const DeviceEdit = () => {
  const { formProps, saveButtonProps, query } = useForm<ICategory>();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Title"
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
