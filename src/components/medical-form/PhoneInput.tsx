import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, className }) => {
  const formatCanadianPhone = (input: string) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    // Limit to exactly 10 digits
    return digits.slice(0, 10);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCanadianPhone(e.target.value);
    onChange(formatted);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only allow digits, backspace, delete, tab, escape, enter
    if (!/[\d\b\t\x1b\r]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  };

  return (
    <Input
      id="phone"
      type="tel"
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      placeholder="1234567890"
      maxLength={10} // 10 digits only
      className="w-full"
    />
  );
};