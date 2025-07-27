import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface SideClickableOptionsProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  allowOther?: boolean;
  className?: string;
}

export const SideClickableOptions: React.FC<SideClickableOptionsProps> = ({
  options,
  value,
  onChange,
  label,
  allowOther = false,
  className
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleOption = (option: string) => {
    if (option === "None / Not Applicable") {
      onChange(value.includes(option) ? [] : [option]);
      return;
    }

    if (value.includes("None / Not Applicable")) {
      onChange([option]);
      return;
    }

    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    
    onChange(newValue);
  };

  const addCustomOption = () => {
    if (customInput.trim() && !value.includes(customInput.trim())) {
      const newValue = value.includes("None / Not Applicable") 
        ? [customInput.trim()] 
        : [...value, customInput.trim()];
      onChange(newValue);
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  const removeOption = (option: string) => {
    onChange(value.filter(v => v !== option));
  };

  const clearSelection = () => {
    onChange([]);
  };

  const hasNoneSelected = value.includes("None / Not Applicable");

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {label && (
        <Label className="text-sm font-medium text-foreground">{label}</Label>
      )}

      {/* Selected options */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((option, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-2">
              <span>{option}</span>
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeOption(option)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Available options */}
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <Button
            key={index}
            type="button"
            variant={value.includes(option) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption(option)}
            disabled={hasNoneSelected && option !== "None / Not Applicable"}
            className="text-sm"
          >
            {option}
          </Button>
        ))}
      </div>

      {/* Custom input */}
      {allowOther && (
        <div className="space-y-2">
          {!showCustomInput ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(true)}
              disabled={hasNoneSelected}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Other
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom option..."
                onKeyPress={(e) => e.key === 'Enter' && addCustomOption()}
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={addCustomOption}
                disabled={!customInput.trim()}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomInput('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Clear selection button */}
      {hasNoneSelected && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearSelection}
          className="text-sm"
        >
          Clear selection
        </Button>
      )}
    </div>
  );
};