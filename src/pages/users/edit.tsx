import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Tag } from "antd";
import { IUser, UserRole, UserStatus } from "../../interfaces/user";

export const UserEdit = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm<IUser>({
    mutationMode: "optimistic",
  });

  const userData = query?.data?.data; // Dữ liệu user từ API

  // Màu sắc của Role và Status trong Select
  const roleColors: Record<UserRole, string> = {
    [UserRole.ADMIN]: "gold",
    [UserRole.USER]: "blue",
  };

  const statusColors: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: "green",
    [UserStatus.INACTIVE]: "red",
  };

  const onSubmit = (values: any) => {
    onFinish({
      ...values,
      role: values.role === UserRole.USER ? 2 : 1,

      status: values.status === UserStatus.ACTIVE ? 1 : 2,
    });
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          fullName: userData?.fullName || "",
          email: userData?.email || "",
          role: userData?.role.name || UserRole.USER,
          status: userData?.status.name || UserStatus.ACTIVE,
          createdAt: userData?.createdAt || "",
        }}
        onFinish={onSubmit}
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Full Name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Role is required" }]}
        >
          <Select
            options={Object.values(UserRole).map((role) => ({
              label: <Tag color={roleColors[role]}>{role}</Tag>,
              value: role,
            }))}
          />
        </Form.Item>

        {/* Status */}
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Status is required" }]}
        >
          <Select
            options={Object.values(UserStatus).map((status) => ({
              label: <Tag color={statusColors[status]}>{status}</Tag>,
              value: status,
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
