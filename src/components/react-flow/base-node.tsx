import { cn } from '@/utility/tailwind';
import React from 'react';

export const BaseNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-md border bg-card p-5 text-card-foreground',
      className,
      selected ? 'border-muted-foreground shadow-lg' : '',
      'hover:ring-1'
    )}
    {...props}
  />
));
BaseNode.displayName = 'BaseNode';
