import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ClickableOptionsProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  allowOther?: boolean;
  className?: string;
}

export const ClickableOptions: React.FC<ClickableOptionsProps> = ({
  options,
  value,
  onChange,
  label,
  allowOther = true,
  className
}) => {
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleOption = (option: string) => {
    if (option === 'None / Not Applicable') {
      onChange(['None / Not Applicable']);
      return;
    }

    if (value.includes('None / Not Applicable')) {
      onChange([option]);
      return;
    }

    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const addCustomValue = () => {
    if (customValue.trim() && !value.includes(customValue.trim())) {
      onChange([...value.filter(v => v !== 'None / Not Applicable'), customValue.trim()]);
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  const removeCustomValue = (customVal: string) => {
    onChange(value.filter(v => v !== customVal));
  };

  const isNoneSelected = value.includes('None / Not Applicable');

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <h3 className="text-lg font-medium">{label}</h3>
      
      {/* Selected items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary" className="multi-select-item">
              {item}
              <X 
                className="remove-item-btn ml-2" 
                onClick={() => onChange(value.filter(v => v !== item))}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Clickable options */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant={value.includes(option) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption(option)}
            disabled={isNoneSelected && option !== 'None / Not Applicable'}
            className="justify-start text-left h-auto py-2 px-3 whitespace-normal"
          >
            {option}
          </Button>
        ))}
      </div>

      {/* Add custom option */}
      {allowOther && !isNoneSelected && (
        <div className="space-y-2">
          {!showCustomInput ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Other
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Enter custom option"
                onKeyPress={(e) => e.key === 'Enter' && addCustomValue()}
              />
              <Button type="button" size="sm" onClick={addCustomValue}>
                Add
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomValue('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};