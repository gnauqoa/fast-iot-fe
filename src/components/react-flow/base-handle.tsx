import React from 'react';
import { Handle, HandleProps } from '@xyflow/react';
import { cn } from '@/utility/tailwind';

export const BaseHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & HandleProps
>(({ className, ...props }, ref) => <Handle ref={ref} className={cn('', className)} {...props} />);
BaseHandle.displayName = 'BaseHandle';
