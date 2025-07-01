import { Table, Tag, Input, Select, Button, Form, Space } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { IDevice, DeviceStatus, statusColors } from '@/interfaces/device';
import { CrudFilters, Link, useGetIdentity } from '@refinedev/core';
import { capitalize } from '@/utility/text';
import { EditButton, ShowButton, DeleteButton, useTable } from '@refinedev/antd';
import { DeviceModal } from '@/components/devices';
import { IUser, UserRole } from '@/interfaces/user';

export const DeviceList = () => {
  const { data: identity } = useGetIdentity<IUser>();
  const { tableProps, searchFormProps, tableQuery } = useTable<IDevice>({
    resource: 'devices',
    syncWithLocation: true,
    onSearch: params => {
      const filters: CrudFilters = [];
      const { name, status } = params as any;

      if (name) {
        filters.push({
          field: 'name',
          operator: 'contains',
          value: name,
        });
      }

      if (status) {
        filters.push({
          field: 'status',
          operator: 'eq',
          value: status === DeviceStatus.Offline ? 0 : 1,
        });
      }

      return filters;
    },
    defaultSetFilterBehavior: 'replace',
  });

  const [devices, setDevices] = useState<IDevice[]>([]);
  const [open, setOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<IDevice | undefined>(undefined);

  const handleCloseModal = () => {
    setOpen(false);
    setEditDevice(undefined);
  };

  useEffect(() => {
    if (!tableQuery.data?.data) return;

    const newDevices = tableQuery.data.data;
    setDevices(newDevices);
  }, [tableQuery.data?.data]);

  return (
    <>
      <Form layout="inline" {...searchFormProps} style={{ marginBottom: 16, gap: 12 }}>
        <Form.Item name="name">
          <Input placeholder="Search by name..." prefix={<SearchOutlined />} allowClear />
        </Form.Item>

        <Form.Item name="status">
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 180 }}
            options={Object.values(DeviceStatus).map((status: DeviceStatus) => ({
              label: (
                <Tag color={statusColors[status]} style={{ margin: 0 }}>
                  {capitalize(String(status))}
                </Tag>
              ),
              value: status,
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
            Filter
          </Button>
        </Form.Item>

        <Button
          type="primary"
          style={{ marginLeft: 'auto' }}
          onClick={() => {
            setEditDevice(undefined);
            setOpen(true);
          }}
        >
          Create Device
        </Button>
      </Form>

      {/* Devices Table */}
      <Table {...tableProps} dataSource={devices} rowKey="id" scroll={{ x: 800 }}>
        <Table.Column title="ID" dataIndex="id" key="id" width={60} />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(status: DeviceStatus) => (
            <Tag color={statusColors[status]} style={{ margin: 0, fontWeight: 'bold' }}>
              {capitalize(status)}
            </Tag>
          )}
        />
        <Table.Column title="Author" dataIndex={['user', 'fullName']} key="user" />

        <Table.Column
          title="Template"
          render={(val, record: IDevice) => (
            <Link to={`/templates/edit/${record.template?.id}`}>{record.template?.name}</Link>
          )}
          dataIndex={['template', 'name', 'id']}
          key="template"
        />

        <Table.Column
          title="Last Update"
          dataIndex="lastUpdate"
          key="lastUpdate"
          render={(date: string) => (date ? new Date(date).toLocaleString() : '-')}
          sorter={(a: IDevice, b: IDevice) =>
            new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime()
          }
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: IDevice) => (
            <Space>
              <EditButton
                hideText
                size="small"
                onClick={() => {
                  setEditDevice(record);
                  setOpen(true);
                }}
              />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>

      {/* Device Modal */}
      <DeviceModal
        open={open}
        device={editDevice}
        onCancel={handleCloseModal}
        onSuccess={handleCloseModal}
      />
    </>
  );
};
