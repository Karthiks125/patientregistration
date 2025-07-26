import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonGroupProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      {options.map((option) => (
        <Button
          key={option}
          type="button"
          variant={value === option ? "default" : "outline"}
          onClick={() => onChange(option)}
          className="slide-in"
        >
          {option}
        </Button>
      ))}
    </div>
  );
};