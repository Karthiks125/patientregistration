import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AutocompleteFieldProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowNone?: boolean;
}

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  options,
  value,
  onChange,
  placeholder = "Type to search...",
  className,
  allowNone = true
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Add "Other" and "None / Not Applicable" options if not present
  const enhancedOptions = [...options];
  if (allowNone && !enhancedOptions.some(opt => opt.toLowerCase().includes("none") || opt.toLowerCase().includes("not applicable"))) {
    enhancedOptions.push("None / Not Applicable");
  }
  if (!enhancedOptions.includes("Other")) {
    enhancedOptions.push("Other");
  }

  const filteredOptions = enhancedOptions.filter(option =>
    option.toLowerCase().includes(value.toLowerCase()) && option !== value
  );

  const selectOption = (option: string) => {
    onChange(option);
    setShowSuggestions(false);
  };

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    setShowSuggestions(true);
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className="field-input"
      />

      {/* Suggestions dropdown */}
      {showSuggestions && value && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Prioritize "None / Not Applicable" and "Other" options */}
          {filteredOptions
            .sort((a, b) => {
              if (a.toLowerCase().includes("none") || a.toLowerCase().includes("not applicable")) return -1;
              if (b.toLowerCase().includes("none") || b.toLowerCase().includes("not applicable")) return 1;
              if (a === "Other") return -1;
              if (b === "Other") return 1;
              return 0;
            })
            .slice(0, 12)
            .map((option, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm transition-colors",
                  (option.toLowerCase().includes("none") || option.toLowerCase().includes("not applicable")) && "bg-muted/50 font-medium",
                  option === "Other" && "text-primary font-medium"
                )}
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