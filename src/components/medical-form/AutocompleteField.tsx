import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AutocompleteFieldProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  options,
  value,
  onChange,
  placeholder = "Type to search...",
  className
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(value.toLowerCase())
  );

  const selectOption = (option: string) => {
    onChange(option);
    setShowSuggestions(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && value && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.slice(0, 10).map((option, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm"
              onClick={() => selectOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};