import { Label } from '@/components/radix/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/radix/select';
import { capitalizeFirstLetter } from '@/utility/string';

const SelectProperty = ({
  label,
  value,
  onValueChange,
  options,
  name,
  placeholder,
}: {
  placeholder?: string;
  options: { label: string; value: string }[];
  label: string;
  value: string;
  name: string;
  onValueChange: (value: string) => void;
}) => {
  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Label className="min-w-[20%]" htmlFor={name}>
        {label}
      </Label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {capitalizeFirstLetter(option.label)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectProperty;
