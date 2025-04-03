import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DateField,
  getDefaultSortOrder,
  DeleteButton,
} from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  Table,
  Space,
  Form,
  Input,
  DatePicker,
  Button,
  Tag,
  Select,
} from "antd";
import { IUser, UserStatus, UserRole } from "../../interfaces/user";
import {
  CrudFilters,
  HttpError,
  LogicalFilter,
  useSubscription,
} from "@refinedev/core";
import dayjs from "dayjs";
import { UserCreateModal } from "../../components/users";

const { RangePicker } = DatePicker;
const roleColors: Record<UserRole, string> = {
  [UserRole.ADMIN]: "gold",
  [UserRole.USER]: "blue",
};

const statusColors: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: "green",
  [UserStatus.INACTIVE]: "red",
};

export const UserList = () => {
  const { tableProps, searchFormProps, sorter, filters } = useTable<
    IUser,
    HttpError,
    {
      fullName: string;
      createdAt: [string, string]; // Dữ liệu từ URL có thể là string
      role: string;
      status: string;
    }
  >({
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { fullName, createdAt, role, status } = params as any;

      if (fullName) {
        filters.push({
          field: "fullName",
          operator: "contains",
          value: fullName,
        });
      }

      if (createdAt && Array.isArray(createdAt) && createdAt.length === 2) {
        const startDate = dayjs(createdAt[0]);
        const endDate = dayjs(createdAt[1]);

        if (startDate.isValid() && endDate.isValid()) {
          filters.push(
            {
              field: "createdAt",
              operator: "gte",
              value: startDate.toISOString(),
            },
            {
              field: "createdAt",
              operator: "lte",
              value: endDate.toISOString(),
            }
          );
        }
      }

      if (role) {
        filters.push({ field: "role.name", operator: "eq", value: role });
      }

      if (status) {
        filters.push({ field: "status.name", operator: "eq", value: status });
      }

      return filters;
    },
    defaultSetFilterBehavior: "replace",
  });
  useSubscription({
    channel: "messages",
    onLiveEvent: (event) => {
      console.log({
        message: `Tin nhắn mới: ${event.payload.text}`,
      });
    },
  });

  // Chuyển filters thành initialValues
  const initialValues = {
    fullName:
      (filters as LogicalFilter[])?.find((f) => f.field === "fullName")
        ?.value || "",
    role:
      (filters as LogicalFilter[])?.find((f) => f.field === "role.name")
        ?.value || undefined,
    status:
      (filters as LogicalFilter[])?.find((f) => f.field === "status.name")
        ?.value || undefined,
    createdAt: (() => {
      const gte = (filters as LogicalFilter[])?.find(
        (f) => f.field === "createdAt" && f.operator === "gte"
      )?.value;
      const lte = (filters as LogicalFilter[])?.find(
        (f) => f.field === "createdAt" && f.operator === "lte"
      )?.value;

      if (gte && lte) {
        return [dayjs(gte), dayjs(lte)];
      }
      return [];
    })(),
  };

  const handleClearFilters = () => {
    searchFormProps.form?.setFieldsValue({
      fullName: undefined,
      role: undefined,
      status: undefined,
      createdAt: undefined,
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
            options={Object.values(UserRole).map((role) => ({
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
            options={Object.values(UserStatus).map((status) => ({
              label: (
                <Tag color={statusColors[status]} style={{ margin: 0 }}>
                  {status}
                </Tag>
              ),
              value: status,
            }))}
          />
        </Form.Item>
        {initialValues.createdAt && (
          <Form.Item name="createdAt" initialValue={initialValues.createdAt}>
            <RangePicker />
          </Form.Item>
        )}
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
          dataIndex={["role", "name"]}
          title="Role"
          render={(role: UserRole) => (
            <Tag color={roleColors[role]}>{role}</Tag>
          )}
        />
        <Table.Column
          dataIndex={["status", "name"]}
          title="Status"
          render={(status: UserStatus) => (
            <Tag color={statusColors[status]}>{status}</Tag>
          )}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Created At"
          sorter
          defaultSortOrder={getDefaultSortOrder("createdAt", sorter)}
          render={(value) => <DateField value={value} format="LLL" />}
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
