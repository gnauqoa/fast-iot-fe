import React, { ChangeEventHandler } from 'react';
import { Input } from '@/components/radix/input';
import { Label } from '@/components/radix/label';

const StringProperty = ({
  label,
  value,
  onChange,
  name,
  inputProps,
}: {
  label: string;
  value: number;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) => {
  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Label className="min-w-[20%]" htmlFor={name}>
        {label}
      </Label>
      <Input id={name} value={value} onChange={onChange} placeholder={label} {...inputProps} />
    </div>
  );
};

export default StringProperty;
