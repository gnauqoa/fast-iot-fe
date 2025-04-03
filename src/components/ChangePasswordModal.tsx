import { LockOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";

interface ChangePasswordFormValues {
  password: string;
}

interface ChangePasswordModalProps {
  recordItemId?: string | number;
  resource: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  recordItemId,
  resource,
}) => {
  const { formProps, saveButtonProps, mutationResult } =
    useForm<ChangePasswordFormValues>({
      action: "edit",
      resource,
      id: recordItemId,
      redirect: false, // Không tự động chuyển trang sau khi submit
      onMutationSuccess: () => {
        setModalOpen(false);
      },
    });

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Button
        size="small"
        icon={<LockOutlined />}
        onClick={() => setModalOpen(true)}
      />
      <Modal
        title={`Changing ${resource} password`}
        closable
        open={modalOpen}
        width={500}
        okButtonProps={{
          ...saveButtonProps,
          loading: mutationResult?.isLoading,
        }}
        onCancel={closeModal}
        afterClose={() => formProps.form?.resetFields()}
      >
        <Form {...formProps} layout="vertical">
          <Form.Item
            label="New password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
