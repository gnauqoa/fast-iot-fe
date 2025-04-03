import { List } from "@refinedev/antd";
import { Tabs } from "antd";
import { useState } from "react";
import { DeviceTable, DeviceMap } from "../../components/devices";
import { TableOutlined, EnvironmentOutlined } from "@ant-design/icons";

export const DeviceList = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <List
      headerButtons={[
        <Tabs
          key="view-tabs"
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          style={{ marginBottom: 0 }}
          items={[
            {
              key: "list",
              label: <TableOutlined style={{ fontSize: "20px" }} />,
            },
            {
              key: "map",
              label: <EnvironmentOutlined style={{ fontSize: "20px" }} />,
            },
          ]}
        />,
      ]}
    >
      {activeTab === "list" ? <DeviceTable /> : <DeviceMap />}
    </List>
  );
};
