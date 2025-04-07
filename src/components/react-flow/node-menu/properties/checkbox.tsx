import { Checkbox } from '@/components/radix/checkbox';
import { Label } from '@/components/radix/label';
import { CheckedState } from '@radix-ui/react-checkbox';

const CheckboxProperty = ({
  label,
  value,
  name,
  onCheckedChange,
}: {
  label: string;
  value: boolean;
  name: string;
  onCheckedChange: (checked: CheckedState) => void;
}) => {
  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Label className="min-w-[20%]" htmlFor={name}>
        {label}
      </Label>
      <Checkbox className="ml-auto" id={name} checked={value} onCheckedChange={onCheckedChange} />
    </div>
  );
};

export default CheckboxProperty;
