import { useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { StatusModal } from './status-modal';

interface StatusCreateModalProps {
  onSuccess?: () => void;
}

export const StatusCreateModal = ({ onSuccess }: StatusCreateModalProps = {}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    message.success('Status created successfully');
    // Call parent's onSuccess callback if provided
    onSuccess?.();
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
        Create Status
      </Button>

      <StatusModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};
