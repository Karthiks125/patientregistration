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

  // Add "Other" and "None / Not Applicable" options if not present
  const enhancedOptions = [...options];
  if (!enhancedOptions.some(opt => opt.toLowerCase().includes("none") || opt.toLowerCase().includes("not applicable"))) {
    enhancedOptions.push("None / Not Applicable");
  }
  if (!enhancedOptions.includes("Other")) {
    enhancedOptions.push("Other");
  }

  // Check if "None / Not Applicable" is selected
  const hasNoneSelected = value.some(v => 
    v === "None / Not Applicable" || 
    v === "None" || 
    v.toLowerCase().includes("not applicable")
  );

  const filteredOptions = enhancedOptions.filter(
    option => 
      option.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(option)
  );

  const addItem = (item: string) => {
    if (!item || value.includes(item)) return;

    // Check if adding "None / Not Applicable" - clear all other entries
    if (item === "None / Not Applicable" || 
        item === "None" || 
        item.toLowerCase().includes("not applicable")) {
      onChange([item]);
      setInputValue('');
      setShowSuggestions(false);
      return;
    }

    // Don't allow adding if "None" is already selected
    if (hasNoneSelected) {
      setInputValue('');
      setShowSuggestions(false);
      return;
    }

    onChange([...value, item]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeItem = (item: string) => {
    onChange(value.filter(v => v !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (allowCustom || enhancedOptions.includes(inputValue.trim())) {
        addItem(inputValue.trim());
      }
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={cn(
                "multi-select-item text-sm px-3 py-1",
                (item.toLowerCase().includes("none") || item.toLowerCase().includes("not applicable")) && "bg-muted border-2 border-dashed"
              )}
            >
              {item}
              <X 
                className="remove-item-btn ml-2 h-3 w-3 cursor-pointer" 
                onClick={() => removeItem(item)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Input field - disabled if "None" is selected */}
      {!hasNoneSelected && (
        <div className="space-y-3">
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
                className="flex-1 field-input"
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
                {filteredOptions
                  .sort((a, b) => {
                    // Prioritize "None / Not Applicable" and "Other" options
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
                      onClick={() => addItem(option)}
                    >
                      {option}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={() => {
              if (inputValue.trim()) {
                addItem(inputValue.trim());
              }
            }}
            disabled={!inputValue.trim()}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another
          </Button>
        </div>
      )}

      {/* Show option to clear "None" selection */}
      {hasNoneSelected && (
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          onClick={() => onChange([])}
          className="w-full text-muted-foreground"
        >
          Clear selection to add items
        </Button>
      )}
    </div>
  );
};