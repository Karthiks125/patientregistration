import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectFieldProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
  className?: string;
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  options,
  value,
  onChange,
  placeholder = "Type to search...",
  allowCustom = false,
  className
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredOptions = options.filter(
    option => 
      option.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(option)
  );

  const addItem = (item: string) => {
    if (!value.includes(item)) {
      onChange([...value, item]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeItem = (item: string) => {
    onChange(value.filter(v => v !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (allowCustom || options.includes(inputValue.trim())) {
        addItem(inputValue.trim());
      }
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Selected items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary" className="multi-select-item">
              {item}
              <X 
                className="remove-item-btn" 
                onClick={() => removeItem(item)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1"
          />
          {allowCustom && inputValue.trim() && (
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => addItem(inputValue.trim())}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.slice(0, 10).map((option, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm"
                onClick={() => addItem(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};