import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AutocompleteField } from './AutocompleteField';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface SpecialistEntry {
  specialist: string;
  doctorName?: string;
}

interface SpecialistFieldProps {
  value: SpecialistEntry[];
  onChange: (value: SpecialistEntry[]) => void;
  specialistOptions: string[];
  className?: string;
}

export const SpecialistField: React.FC<SpecialistFieldProps> = ({
  value,
  onChange,
  specialistOptions,
  className
}) => {
  const [currentEntry, setCurrentEntry] = useState<SpecialistEntry>({
    specialist: '',
    doctorName: ''
  });

  const addEntry = () => {
    if (currentEntry.specialist.trim()) {
      const newEntry = {
        specialist: currentEntry.specialist.trim(),
        ...(currentEntry.doctorName?.trim() && { doctorName: currentEntry.doctorName.trim() })
      };
      onChange([...value, newEntry]);
      setCurrentEntry({ specialist: '', doctorName: '' });
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
              <span>
                {entry.specialist}
                {entry.doctorName && ` - Dr. ${entry.doctorName}`}
              </span>
              <X 
                className="remove-item-btn" 
                onClick={() => removeEntry(index)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Add new entry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <AutocompleteField
            options={specialistOptions}
            value={currentEntry.specialist}
            onChange={(specialist) => setCurrentEntry(prev => ({ ...prev, specialist }))}
            placeholder="Specialist type"
          />
        </div>

        <div>
          <Input
            type="text"
            value={currentEntry.doctorName || ''}
            onChange={(e) => setCurrentEntry(prev => ({ ...prev, doctorName: e.target.value }))}
            placeholder="Doctor's name (optional)"
          />
        </div>

        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={addEntry}
          disabled={!currentEntry.specialist.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};