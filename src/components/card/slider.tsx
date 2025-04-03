import { Card, Slider, Typography } from "antd";

interface SliderCardProps {
  title: string;
  value: number;
  unit?: string; // Thêm đơn vị
  min?: number;
  max?: number;
  step?: number;
  onFinalChange: (value: number) => void; // Chỉ gọi khi thả chuột
  onChange: (value: number) => void; // Cập nhật UI ngay lập tức
}

export const SliderCard: React.FC<SliderCardProps> = ({
  title,
  value,
  unit = "",
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onFinalChange,
}) => {
  return (
    <Card>
      <Typography.Title level={5}>{title}</Typography.Title>
      <Typography.Text strong>
        {value} {unit} {/* Hiển thị giá trị và đơn vị */}
      </Typography.Text>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange} // Chỉ cập nhật UI, không gọi API
        onAfterChange={onFinalChange} // Chỉ gọi API khi thả chuột
      />
    </Card>
  );
};
