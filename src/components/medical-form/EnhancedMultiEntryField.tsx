import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SideAutocompleteField } from './SideAutocompleteField';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface EnhancedEntryItem {
  name: string;
  eye?: string;
  doctor?: string;
}

interface EnhancedMultiEntryFieldProps {
  value: EnhancedEntryItem[];
  onChange: (value: EnhancedEntryItem[]) => void;
  options: string[];
  placeholder?: string;
  showEyeSelection?: boolean;
  showDoctorField?: boolean;
  className?: string;
}

export const EnhancedMultiEntryField: React.FC<EnhancedMultiEntryFieldProps> = ({
  value,
  onChange,
  options,
  placeholder = "Type to search...",
  showEyeSelection = true,
  showDoctorField = true,
  className
}) => {
  const [currentEntry, setCurrentEntry] = useState<EnhancedEntryItem>({
    name: '',
    eye: '',
    doctor: ''
  });

  const eyeOptions = ["Left", "Right", "Both"];

  // Check if "None / Not Applicable" is selected
  const hasNoneSelected = value.some(item => 
    item.name === "None / Not Applicable" || 
    item.name === "None" || 
    item.name.toLowerCase().includes("not applicable")
  );

  const addEntry = () => {
    if (!currentEntry.name) return;

    // If adding "None / Not Applicable", clear all other entries
    if (currentEntry.name === "None / Not Applicable" || 
        currentEntry.name === "None" || 
        currentEntry.name.toLowerCase().includes("not applicable")) {
      onChange([{ name: currentEntry.name }]);
      setCurrentEntry({ name: '', eye: '', doctor: '' });
      return;
    }

    // Don't allow adding if "None" is already selected
    if (hasNoneSelected) {
      return;
    }

    const newEntry: EnhancedEntryItem = {
      name: currentEntry.name,
      ...(showEyeSelection && currentEntry.eye && { eye: currentEntry.eye }),
      ...(showDoctorField && currentEntry.doctor && { doctor: currentEntry.doctor })
    };

    onChange([...value, newEntry]);
    setCurrentEntry({ name: '', eye: '', doctor: '' });
  };

  const removeEntry = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const isAddDisabled = !currentEntry.name || hasNoneSelected;

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Current entries */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((entry, index) => (
            <Badge key={index} variant="secondary" className="multi-select-item justify-between p-3">
              <div className="flex flex-col gap-1 text-left">
                <span className="font-medium">{entry.name}</span>
                {entry.eye && (
                  <span className="text-xs text-muted-foreground">Eye: {entry.eye}</span>
                )}
                {entry.doctor && (
                  <span className="text-xs text-muted-foreground">Doctor: {entry.doctor}</span>
                )}
              </div>
              <X 
                className="remove-item-btn cursor-pointer" 
                onClick={() => removeEntry(index)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Add new entry - disabled if "None" is selected */}
      {!hasNoneSelected && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <SideAutocompleteField
              options={options}
              value={currentEntry.name}
              onChange={(name) => setCurrentEntry(prev => ({ ...prev, name }))}
              placeholder={placeholder}
            />

            {showEyeSelection && currentEntry.name && currentEntry.name !== "None / Not Applicable" && (
              <Select 
                value={currentEntry.eye} 
                onValueChange={(eye) => setCurrentEntry(prev => ({ ...prev, eye }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Which eye?" />
                </SelectTrigger>
                <SelectContent>
                  {eyeOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {showDoctorField && currentEntry.name && currentEntry.name !== "None / Not Applicable" && (
              <Input
                value={currentEntry.doctor}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, doctor: e.target.value }))}
                placeholder="Doctor's name (optional)"
              />
            )}
          </div>

          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={addEntry}
            disabled={isAddDisabled}
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