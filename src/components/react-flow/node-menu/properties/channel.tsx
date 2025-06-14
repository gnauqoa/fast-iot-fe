import { Label } from '@/components/radix/label';
import { Input } from '@/components/radix/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/radix/select';
import { capitalizeFirstLetter } from '@/utility/string';
import { useState } from 'react';

interface ChannelPropertyProps {
  label: string;
  value: string;
  name: string;
  onValueChange: (value: string) => void;
  existingChannels: string[];
  placeholder?: string;
}

const ChannelProperty = ({
  label,
  value,
  onValueChange,
  existingChannels,
  name,
}: ChannelPropertyProps) => {
  const [isCustom, setIsCustom] = useState(!existingChannels.includes(value));

  const handleSelectChange = (newValue: string) => {
    if (newValue === 'custom') {
      setIsCustom(true);
      onValueChange('');
    } else {
      setIsCustom(false);
      onValueChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
  };

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Label className="min-w-[20%]" htmlFor={name}>
        {label}
      </Label>
      {isCustom ? (
        <div className="flex w-[180px] items-center gap-2">
          <Input
            id={name}
            value={value}
            onChange={handleInputChange}
            placeholder="Enter channel name"
            className="flex-1"
          />
          <Select value="custom" onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="custom">Custom</SelectItem>
                {existingChannels.map(channel => (
                  <SelectItem key={channel} value={channel}>
                    {capitalizeFirstLetter(channel)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <Select value={value} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={value} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="custom">Custom</SelectItem>
              {existingChannels.map(channel => (
                <SelectItem key={channel} value={channel}>
                  {capitalizeFirstLetter(channel)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default ChannelProperty;
