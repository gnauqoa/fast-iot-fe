import { Card, Flex, Typography } from "antd";
import { ReactNode } from "react";

const { Title } = Typography;

export const SensorCard = ({
  icon,
  title,
  value,
  uint,
}: {
  icon: ReactNode;
  title: string;
  value?: number | string | null;
  uint: string;
}) => {
  return (
    <Card hoverable>
      <Flex vertical gap={12}>
        <Flex gap={12} align="center">
          {icon}
          <Title style={{ margin: 0 }} level={4}>
            {title}
          </Title>
        </Flex>
        <Flex align="start">
          <Title style={{ margin: 0 }} level={2}>
            {value ?? "0"}
          </Title>
          <Title style={{ margin: "0px 0px 0px 4px" }} level={5}>
            {uint}
          </Title>
        </Flex>
      </Flex>
    </Card>
  );
};
