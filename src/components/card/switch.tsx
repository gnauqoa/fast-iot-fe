import { useEffect, useState } from "react";
import { Card, Flex, Switch, Typography } from "antd";

const { Title } = Typography;

export const SwitchCard = ({
  title,
  onChange,
  value,
}: {
  title: string;
  onChange?: (checked: boolean) => void;
  value: boolean;
}) => {
  // 🛠️ Manage internal state
  const [checked, setChecked] = useState<boolean>(value);

  const handleToggle = (newChecked: boolean) => {
    setChecked(newChecked); // Update internal state
    if (onChange) onChange(newChecked); // Call external handler if provided
  };

  useEffect(() => {
    if (value !== checked) setChecked(value);
  }, [value]);

  return (
    <Card
      hoverable
      style={{
        background: checked ? "#1890ff" : "#1e1e2f",
        color: "white",
        borderRadius: "12px",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
      }}
      bodyStyle={{ padding: "16px" }}
    >
      <Flex vertical gap={12} align="center">
        <Title style={{ margin: 0, color: "white" }} level={4}>
          {title}
        </Title>
        <Switch checked={checked} onChange={handleToggle} />
      </Flex>
    </Card>
  );
};
