import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface SideAutocompleteFieldProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowNone?: boolean;
}

export const SideAutocompleteField: React.FC<SideAutocompleteFieldProps> = ({
  options,
  value,
  onChange,
  placeholder = "Start typing...",
  className,
  allowNone = true
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhance options with standard items
  const enhancedOptions = React.useMemo(() => {
    const enhanced = [...options];
    if (allowNone && !enhanced.includes("None / Not Applicable")) {
      enhanced.unshift("None / Not Applicable");
    }
    if (!enhanced.includes("Other")) {
      enhanced.push("Other");
    }
    return enhanced;
  }, [options, allowNone]);

  useEffect(() => {
    if (value && showSuggestions) {
      const filtered = enhancedOptions.filter(option =>
        option.toLowerCase().includes(value.toLowerCase()) && option !== value
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  }, [value, showSuggestions, enhancedOptions]);

  const selectOption = (option: string) => {
    onChange(option);
    setShowSuggestions(false);
  };

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    setShowSuggestions(true);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full"
      />
      
      {showSuggestions && filteredOptions.length > 0 && (
        <div className="absolute left-full top-0 ml-2 w-64 bg-background border border-border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
          {filteredOptions.slice(0, 5).map((option, index) => (
            <button
              key={index}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-sm border-b border-border last:border-b-0"
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