import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SideAutocompleteField } from './SideAutocompleteField';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface MultiEntryItem {
  medicationName: string;
  dosage: string;
  affectedEye: string;
}

interface MultiEntryFieldProps {
  value: any[];
  onChange: (value: any[]) => void;
  medicationOptions: string[];
  className?: string;
}

export const MultiEntryField: React.FC<MultiEntryFieldProps> = ({
  value,
  onChange,
  medicationOptions,
  className
}) => {
  const [currentEntry, setCurrentEntry] = useState<MultiEntryItem>({
    medicationName: '',
    dosage: '',
    affectedEye: ''
  });

  const dosageOptions = [
    "Once daily",
    "Twice daily", 
    "Thrice daily",
    "Four times daily",
    "Five times daily",
    "More than 5 times daily"
  ];

  const eyeOptions = ["Left", "Right", "Both"];

  const addEntry = () => {
    if (currentEntry.medicationName && currentEntry.dosage && currentEntry.affectedEye) {
      onChange([...value, currentEntry]);
      setCurrentEntry({ medicationName: '', dosage: '', affectedEye: '' });
    }
  };

  const removeEntry = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Current entries */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((entry, index) => (
            <Badge key={index} variant="secondary" className="multi-select-item justify-between">
              <span>{entry.medicationName} - {entry.dosage} - {entry.affectedEye}</span>
              <X 
                className="remove-item-btn" 
                onClick={() => removeEntry(index)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Add new entry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="md:col-span-1">
          <SideAutocompleteField
            options={medicationOptions}
            value={currentEntry.medicationName}
            onChange={(medicationName) => setCurrentEntry(prev => ({ ...prev, medicationName }))}
            placeholder="Medication name"
          />
        </div>

        <div>
          <Select 
            value={currentEntry.dosage} 
            onValueChange={(dosage) => setCurrentEntry(prev => ({ ...prev, dosage }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Dosage frequency" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {dosageOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select 
            value={currentEntry.affectedEye} 
            onValueChange={(affectedEye) => setCurrentEntry(prev => ({ ...prev, affectedEye }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Affected eye(s)" />
            </SelectTrigger>
            <SelectContent>
              {eyeOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={addEntry}
          disabled={!currentEntry.medicationName || !currentEntry.dosage || !currentEntry.affectedEye}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};