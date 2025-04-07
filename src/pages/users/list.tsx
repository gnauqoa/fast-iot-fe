import {
  List,
  useTable,
  EditButton,
  DateField,
  getDefaultSortOrder,
  DeleteButton,
} from '@refinedev/antd';
import { SearchOutlined } from '@ant-design/icons';
import { Table, Space, Form, Input, Button, Tag, Select } from 'antd';
import { IUser, UserStatus, UserRole } from '@/interfaces/user';
import { CrudFilters, HttpError, LogicalFilter, useSubscription } from '@refinedev/core';
import { UserCreateModal } from '@/components/users';

const roleColors: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'gold',
  [UserRole.USER]: 'blue',
};

const statusColors: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'green',
  [UserStatus.INACTIVE]: 'red',
};

export const UserList = () => {
  const { tableProps, searchFormProps, sorter, filters } = useTable<
    IUser,
    HttpError,
    {
      fullName: string;
      role: string;
      status: string;
    }
  >({
    onSearch: params => {
      const filters: CrudFilters = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { fullName, role, status } = params as any;

      if (fullName) {
        filters.push({
          field: 'fullName',
          operator: 'contains',
          value: fullName,
        });
      }

      if (role) {
        filters.push({ field: 'role.name', operator: 'eq', value: role });
      }

      if (status) {
        filters.push({ field: 'status.name', operator: 'eq', value: status });
      }

      return filters;
    },
    defaultSetFilterBehavior: 'replace',
  });
  useSubscription({
    channel: 'messages',
    onLiveEvent: event => {
      console.log({
        message: `Tin nhắn mới: ${event.payload.text}`,
      });
    },
  });

  // Chuyển filters thành initialValues
  const initialValues = {
    fullName: (filters as LogicalFilter[])?.find(f => f.field === 'fullName')?.value || '',
    role: (filters as LogicalFilter[])?.find(f => f.field === 'role.name')?.value || undefined,
    status: (filters as LogicalFilter[])?.find(f => f.field === 'status.name')?.value || undefined,
  };

  const handleClearFilters = () => {
    searchFormProps.form?.setFieldsValue({
      fullName: undefined,
      role: undefined,
      status: undefined,
    });
    searchFormProps.form?.submit();
  };

  return (
    <List headerButtons={<UserCreateModal />}>
      <Form
        layout="inline"
        {...searchFormProps}
        initialValues={initialValues} // Gán initial values từ filters
        style={{ marginBottom: 16, gap: 12 }}
      >
        <Form.Item name="fullName">
          <Input placeholder="User full name" prefix={<SearchOutlined />} />
        </Form.Item>
        <Form.Item name="role">
          <Select
            placeholder="Select Role"
            allowClear
            style={{ width: 150 }}
            options={Object.values(UserRole).map(role => ({
              label: (
                <Tag color={roleColors[role]} style={{ margin: 0 }}>
                  {role}
                </Tag>
              ),
              value: role,
            }))}
          />
        </Form.Item>
        <Form.Item name="status">
          <Select
            placeholder="Select Status"
            allowClear
            style={{ width: 150 }}
            options={Object.values(UserStatus).map(status => ({
              label: (
                <Tag color={statusColors[status]} style={{ margin: 0 }}>
                  {status}
                </Tag>
              ),
              value: status,
            }))}
          />
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

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="fullName" title="Full Name" />
        <Table.Column
          dataIndex={['role', 'name']}
          title="Role"
          render={(role: UserRole) => <Tag color={roleColors[role]}>{role}</Tag>}
        />
        <Table.Column
          dataIndex={['status', 'name']}
          title="Status"
          render={(status: UserStatus) => <Tag color={statusColors[status]}>{status}</Tag>}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Created At"
          sorter
          defaultSortOrder={getDefaultSortOrder('createdAt', sorter)}
          render={value => <DateField value={value} format="LLL" />}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
