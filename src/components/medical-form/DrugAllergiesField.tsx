import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface DrugAllergiesFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export const DrugAllergiesField: React.FC<DrugAllergiesFieldProps> = ({
  value,
  onChange,
  className
}) => {
  const [customAllergy, setCustomAllergy] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const commonAllergies = [
    'Penicillin',
    'Sulfa Drugs',
    'Aspirin',
    'Latex',
    'None / Not Applicable'
  ];

  const toggleAllergy = (allergy: string) => {
    if (allergy === 'None / Not Applicable') {
      onChange(['None / Not Applicable']);
      return;
    }

    if (value.includes('None / Not Applicable')) {
      onChange([allergy]);
      return;
    }

    if (value.includes(allergy)) {
      onChange(value.filter(v => v !== allergy));
    } else {
      onChange([...value, allergy]);
    }
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !value.includes(customAllergy.trim())) {
      onChange([...value.filter(v => v !== 'None / Not Applicable'), customAllergy.trim()]);
      setCustomAllergy('');
      setShowCustomInput(false);
    }
  };

  const removeAllergy = (allergy: string) => {
    onChange(value.filter(v => v !== allergy));
  };

  const isNoneSelected = value.includes('None / Not Applicable');

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <Label>Drug Allergies</Label>
      
      {/* Selected allergies */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((allergy, index) => (
            <Badge key={index} variant="secondary" className="multi-select-item">
              {allergy}
              <X 
                className="remove-item-btn ml-2" 
                onClick={() => removeAllergy(allergy)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Common allergies */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {commonAllergies.map((allergy) => (
          <Button
            key={allergy}
            type="button"
            variant={value.includes(allergy) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleAllergy(allergy)}
            disabled={isNoneSelected && allergy !== 'None / Not Applicable'}
            className="justify-start text-left h-auto py-2 px-3"
          >
            {allergy}
          </Button>
        ))}
      </div>

      {/* Add custom allergy */}
      {!isNoneSelected && (
        <div className="space-y-2">
          {!showCustomInput ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Other Allergy
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                type="text"
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                placeholder="Enter specific allergy"
                onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
              />
              <Button type="button" size="sm" onClick={addCustomAllergy}>
                Add
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomAllergy('');
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