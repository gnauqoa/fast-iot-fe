import { Table, Input, Button, Form, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ITemplate } from '@/interfaces/template'; // Import the Template interface
import { DeleteButton, EditButton, useTable } from '@refinedev/antd';
import { CrudFilters } from '@refinedev/core';
import { TemplateModal } from '@/components/templates';

export const TemplateList = () => {
  const { tableProps, searchFormProps } = useTable<ITemplate>({
    resource: 'templates',
    syncWithLocation: true,
    onSearch: params => {
      const filters: CrudFilters = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const [open, setOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<ITemplate | undefined>(undefined);

  const handleCloseModal = () => {
    setOpen(false);
    setEditTemplate(undefined);
  };

  return (
    <>
      {' '}
      <Form layout="inline" {...searchFormProps} style={{ marginBottom: 16, gap: 12 }}>
        <Form.Item name="name">
          <Input placeholder="Search by name..." prefix={<SearchOutlined />} allowClear />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>

        <Button
          type="primary"
          style={{ marginLeft: 'auto' }}
          onClick={() => {
            setEditTemplate(undefined);
            setOpen(true);
          }}
        >
          Create Template
        </Button>
      </Form>
      <Table {...tableProps} rowKey="id">
        <Table.Column title="ID" dataIndex="id" key="id" width={60} />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Description" dataIndex="description" key="description" />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: ITemplate) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
      <TemplateModal
        template={editTemplate}
        open={open}
        onCancel={handleCloseModal}
        onSuccess={handleCloseModal}
      />
    </>
  );
};
