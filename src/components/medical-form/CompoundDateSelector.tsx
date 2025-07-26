import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CompoundDateSelectorProps {
  value: { year?: number; month?: number; day?: number };
  onChange: (value: { year?: number; month?: number; day?: number }) => void;
  className?: string;
}

export const CompoundDateSelector: React.FC<CompoundDateSelectorProps> = ({
  value,
  onChange,
  className
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year?: number, month?: number) => {
    if (!year || !month) return 31;
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from({ 
    length: getDaysInMonth(value.year, value.month) 
  }, (_, i) => i + 1);

  const handleYearChange = (yearStr: string) => {
    const year = parseInt(yearStr);
    onChange({ ...value, year });
  };

  const handleMonthChange = (monthStr: string) => {
    const month = months.indexOf(monthStr) + 1;
    onChange({ ...value, month });
  };

  const handleDayChange = (dayStr: string) => {
    const day = parseInt(dayStr);
    onChange({ ...value, day });
  };

  return (
    <div className={`compound-field ${className || ''}`}>
      <Select value={value.year?.toString()} onValueChange={handleYearChange}>
        <SelectTrigger>
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {years.map(year => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.month ? months[value.month - 1] : undefined} onValueChange={handleMonthChange}>
        <SelectTrigger>
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {months.map(month => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.day?.toString()} onValueChange={handleDayChange}>
        <SelectTrigger>
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {days.map(day => (
            <SelectItem key={day} value={day.toString()}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};