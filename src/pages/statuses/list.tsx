import { List, useTable, DeleteButton, EditButton } from '@refinedev/antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { Table, Form, Input, Button, Tag, Space, message } from 'antd';
import { IStatus } from '@/interfaces/user';
import { CrudFilters, HttpError, LogicalFilter } from '@refinedev/core';
import { useState, useEffect } from 'react';
import { StatusCreateModal, StatusModal } from '@/components/statuses';
import { stringToHexColor } from '@/utility/color';
import { useStatusData } from '@/hooks/use-status-data';

export const StatusList = () => {
  const {
    statuses: reduxStatuses,
    loading: reduxLoading,
    error,
    refreshStatuses,
    clearStatusError,
  } = useStatusData();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<IStatus | undefined>();

  const { tableProps, searchFormProps, filters } = useTable<
    IStatus,
    HttpError,
    {
      name: string;
    }
  >({
    resource: 'statuses',
    onSearch: params => {
      const filters: CrudFilters = [];
      const { name } = params as any;

      if (name) {
        filters.push({
          field: 'name',
          operator: 'contains',
          value: name,
        });
      }

      return filters;
    },
    defaultSetFilterBehavior: 'replace',
  });

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      message.error(`Status data error: ${error}`);
      clearStatusError();
    }
  }, [error, clearStatusError]);

  // Convert filters to initial values
  const initialValues = {
    name: (filters as LogicalFilter[])?.find(f => f.field === 'name')?.value || '',
  };

  const handleClearFilters = () => {
    searchFormProps.form?.setFieldsValue({
      name: undefined,
    });
    searchFormProps.form?.submit();
  };

  const handleEdit = (status: IStatus) => {
    setEditingStatus(status);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditingStatus(undefined);
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setEditingStatus(undefined);
    message.success('Status updated successfully');
    // Refresh Redux data after successful edit
    refreshStatuses();
  };

  const handleCreateSuccess = () => {
    // Success message is handled in the modal component
    // Refresh Redux data after successful creation
    refreshStatuses();
  };

  const handleDeleteSuccess = () => {
    message.success('Status deleted successfully');
    // Refresh Redux data after successful deletion
    refreshStatuses();
  };

  // Combine Refine table data with Redux data for better UX
  // Use Redux data if available, otherwise fall back to Refine data
  const combinedTableProps = {
    ...tableProps,
    dataSource: reduxStatuses?.length > 0 ? reduxStatuses : tableProps.dataSource,
    loading: tableProps.loading || reduxLoading,
  };

  return (
    <List headerButtons={<StatusCreateModal onSuccess={handleCreateSuccess} />} breadcrumb={false}>
      <Form
        layout="inline"
        {...searchFormProps}
        initialValues={initialValues}
        style={{ marginBottom: 16, gap: 12 }}
      >
        <Form.Item name="name">
          <Input placeholder="Status name" prefix={<SearchOutlined />} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Filter
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleClearFilters} danger>
            Clear Filters
          </Button>
        </Form.Item>
      </Form>

      <Table {...combinedTableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column
          dataIndex="name"
          title="Status Name"
          render={(status: string) => (
            <Tag color={stringToHexColor(status)} style={{ fontWeight: 'bold' }}>
              {status}
            </Tag>
          )}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: IStatus) => (
            <Space>
              <EditButton
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(record)}
                hideText
              />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                onSuccess={handleDeleteSuccess}
              />
            </Space>
          )}
        />
      </Table>

      {/* Edit Modal */}
      <StatusModal
        status={editingStatus}
        open={editModalOpen}
        onCancel={handleEditModalClose}
        onSuccess={handleEditSuccess}
      />
    </List>
  );
};
