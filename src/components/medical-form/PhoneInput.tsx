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
    
    // Limit to 10 digits (Canadian format)
    const limitedDigits = digits.slice(0, 10);
    
    // Format as (XXX) XXX-XXXX
    if (limitedDigits.length >= 6) {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    } else if (limitedDigits.length >= 3) {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
    } else {
      return limitedDigits;
    }
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
    <div className={`space-y-2 ${className || ''}`}>
      <Label htmlFor="phone" className="flex items-center gap-2">
        <Phone className="w-4 h-4" />
        Phone Number
      </Label>
      <Input
        id="phone"
        type="tel"
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="(XXX) XXX-XXXX"
        maxLength={14} // (XXX) XXX-XXXX format
        className="w-full"
      />
    </div>
  );
};