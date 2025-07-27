import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CompoundDateSelector } from './CompoundDateSelector';
import { SideAutocompleteField } from './SideAutocompleteField';
import { EnhancedMultiEntryField } from './EnhancedMultiEntryField';
import { ClickableOptions } from './ClickableOptions';
import { DrugAllergiesField } from './DrugAllergiesField';
import { PhoneInput } from './PhoneInput';
import { SpecialistField, SpecialistEntry } from './SpecialistField';
import { MultiEntryField, type MultiEntryItem } from './MultiEntryField';
import { ButtonGroup } from './ButtonGroup';
import { User, Calendar, Mail, Stethoscope, Eye, Heart, Pill, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  eyeSurgeryOptions, 
  eyeLaserOptions, 
  eyeDiseaseOptions, 
  eyeMedicationOptions, 
  medicationOptions, 
  medicalConditionOptions,
  specialistOptions,
  eyeInjuryOptions
} from '@/data/medicalData';

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: {
    day?: number;
    month?: number;
    year?: number;
  };
  email: string;
  phone: string;
  optometrist: string;
  familyDoctor: string;
  contactLensHistory: string;

  // Eye History Arrays  
  specialistsWithDoctors: SpecialistEntry[];
  eyeDiseases: string[];
  eyeSurgeries: any[];
  eyeLasers: any[];
  eyeInjuries: string[];
  eyeDrops: string[];
  eyeMedications: any[];
  medications: string[];
  medicalConditions: string[];
  drugAllergies: string[];
}

export const MedicalIntakeForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: { day: undefined, month: undefined, year: undefined },
    email: '',
    phone: '',
    optometrist: '',
    familyDoctor: '',
    contactLensHistory: '',
    specialistsWithDoctors: [],
    eyeDiseases: [],
    eyeSurgeries: [],
    eyeLasers: [],
    eyeInjuries: [],
    eyeDrops: [],
    eyeMedications: [],
    medications: [],
    medicalConditions: [],
    drugAllergies: []
  });

  const sections = [
    {
      title: 'Personal Information',
      icon: User,
      fields: ['firstName', 'lastName', 'dateOfBirth', 'email', 'phone']
    },
    {
      title: 'Healthcare Providers',
      icon: Stethoscope,
      fields: ['optometrist', 'familyDoctor', 'specialistsWithDoctors']
    },
    {
      title: 'Eye History',
      icon: Eye,
      fields: ['eyeDiseases', 'contactLensHistory', 'eyeSurgeries', 'eyeLasers', 'eyeInjuries', 'eyeDrops', 'eyeMedications']
    },
    {
      title: 'Medical History',
      icon: Heart,
      fields: ['medicalConditions', 'medications']
    },
    {
      title: 'Allergies',
      icon: AlertTriangle,
      fields: ['drugAllergies']
    }
  ];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextSection = () => {
    setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  const validateCurrentSection = () => {
    const currentFields = sections[currentSection].fields;
    let isValid = true;

    if (currentSection === 0) {
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        isValid = false;
      }
      if (!formData.dateOfBirth.day || !formData.dateOfBirth.month || !formData.dateOfBirth.year) {
        isValid = false;
      }
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      nextSection();
    } else {
      toast({
        title: "Please fill in required fields",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async () => {
    if (!validateCurrentSection()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Form submitted:', formData);

      // Prepare data for database insert
      const dbData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: {
          day: formData.dateOfBirth.day || 1,
          month: formData.dateOfBirth.month || 1,
          year: formData.dateOfBirth.year || 1990
        },
        email: formData.email,
        phone: formData.phone || null,
        optometrist: formData.optometrist || null,
        family_doctor: formData.familyDoctor || null,
        specialists_with_doctors: formData.specialistsWithDoctors as any,
        eye_diseases: formData.eyeDiseases,
        contact_lens_history: formData.contactLensHistory || null,
        eye_surgeries: formData.eyeSurgeries,
        eye_lasers: formData.eyeLasers,
        eye_injuries: formData.eyeInjuries,
        eye_drops: formData.eyeDrops,
        eye_medications: formData.eyeMedications,
        medications: formData.medications,
        medical_conditions: formData.medicalConditions,
        drug_allergies: formData.drugAllergies
      };

      // Save to Supabase
      const { data: insertedData, error: insertError } = await supabase
        .from('patient_registrations')
        .insert(dbData)
        .select()
        .single();

      if (insertError) {
        console.error('Error saving to database:', insertError);
        throw new Error('Failed to save registration data');
      }

      console.log('Data saved to database:', insertedData);

      // Prepare data for PDF generation with proper array formatting
      const pdfData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        optometrist: formData.optometrist,
        familyDoctor: formData.familyDoctor,
        specialists: (formData.specialistsWithDoctors || []).map(s => s.specialist),
        eyeDiseases: formData.eyeDiseases || [],
        contactLensHistory: formData.contactLensHistory,
        eyeSurgeries: formData.eyeSurgeries || [],
        eyeLasers: formData.eyeLasers || [],
        eyeInjuries: formData.eyeInjuries || [],
        eyeDrops: formData.eyeDrops || [],
        eyeMedications: formData.eyeMedications || [],
        regularMedications: formData.medications || [],
        regularConditions: formData.medicalConditions || [],
        drugAllergies: formData.drugAllergies || []
      };

      // Call Edge Function to generate PDF and send email
      const { data: pdfResponse, error: pdfError } = await supabase.functions
        .invoke('generate_patient_pdf', {
          body: {
            patientData: pdfData,
            emailTo: 'kartaitesting@gmail.com'
          }
        });

      if (pdfError) {
        console.error('Error generating PDF:', pdfError);
        toast({
          title: "Registration saved successfully!",
          description: "However, there was an issue sending the confirmation email. Please contact us if you need a copy.",
          variant: "default"
        });
      } else {
        console.log('PDF generated and email sent:', pdfResponse);
        // Full screen success message for 7 seconds
        const fullScreenDiv = document.createElement('div');
        fullScreenDiv.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          font-size: 2rem;
          text-align: center;
        `;
        fullScreenDiv.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
          <div style="font-size: 2rem; margin-bottom: 1rem;">Registration Completed Successfully!</div>
          <div style="font-size: 1.2rem;">Your medical intake form has been received and a confirmation has been sent to your email.</div>
        `;
        document.body.appendChild(fullScreenDiv);
        
        setTimeout(() => {
          document.body.removeChild(fullScreenDiv);
          window.location.href = '/';
        }, 7000);
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: { day: undefined, month: undefined, year: undefined },
        email: '',
        phone: '',
        optometrist: '',
        familyDoctor: '',
        contactLensHistory: '',
        specialistsWithDoctors: [],
        eyeDiseases: [],
        eyeSurgeries: [],
        eyeLasers: [],
        eyeInjuries: [],
        eyeDrops: [],
        eyeMedications: [],
        medications: [],
        medicalConditions: [],
        drugAllergies: []
      });
      setCurrentSection(0);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error submitting form",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (fieldName: string) => {
    switch (fieldName) {
      case 'firstName':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <User className="field-icon" />
              First Name <span className="required-indicator">*</span>
            </Label>
            <Input 
              placeholder="Enter your first name" 
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
            />
          </div>
        );

      case 'lastName':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <User className="field-icon" />
              Last Name <span className="required-indicator">*</span>
            </Label>
            <Input 
              placeholder="Enter your last name" 
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
            />
          </div>
        );

      case 'dateOfBirth':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Calendar className="field-icon" />
              Date of Birth <span className="required-indicator">*</span>
            </Label>
            <CompoundDateSelector
              value={formData.dateOfBirth}
              onChange={(value) => updateField('dateOfBirth', value)}
            />
          </div>
        );

      case 'email':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Mail className="field-icon" />
              Email Address
            </Label>
            <Input 
              type="email" 
              placeholder="your.email@example.com" 
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
        );

      case 'phone':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              Phone Number <span className="required-indicator">*</span>
            </Label>
            <PhoneInput
              value={formData.phone}
              onChange={(value) => updateField('phone', value)}
            />
          </div>
        );

      case 'optometrist':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Stethoscope className="field-icon" />
              Current Optometrist
            </Label>
            <Input 
              value={formData.optometrist}
              onChange={(e) => updateField('optometrist', e.target.value)}
              placeholder="Enter optometrist name"
            />
          </div>
        );

      case 'familyDoctor':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Stethoscope className="field-icon" />
              Family Doctor
            </Label>
            <Input 
              value={formData.familyDoctor}
              onChange={(e) => updateField('familyDoctor', e.target.value)}
              placeholder="Enter family doctor name"
            />
          </div>
        );

      case 'specialistsWithDoctors':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Stethoscope className="field-icon" />
              Other Specialists
            </Label>
            <SpecialistField
              specialistOptions={specialistOptions}
              value={formData.specialistsWithDoctors}
              onChange={(value) => updateField('specialistsWithDoctors', value)}
            />
          </div>
        );

      case 'medicalConditions':
        return (
          <div className="field-wrapper fade-in">
            <ClickableOptions
              options={medicalConditionOptions}
              value={formData.medicalConditions}
              onChange={(value) => updateField('medicalConditions', value)}
              label="Medical Conditions"
              allowOther={true}
            />
          </div>
        );

      case 'medications':
        return (
          <div className="field-wrapper fade-in">
            <ClickableOptions
              options={medicationOptions}
              value={formData.medications}
              onChange={(value) => updateField('medications', value)}
              label="Medications"
              allowOther={true}
            />
          </div>
        );

      case 'eyeDiseases':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Eye className="field-icon" />
              Eye Diseases
            </Label>
            <ClickableOptions
              options={eyeDiseaseOptions}
              value={formData.eyeDiseases}
              onChange={(value) => updateField('eyeDiseases', value)}
              label=""
              allowOther={true}
            />
          </div>
        );

      case 'contactLensHistory':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Eye className="field-icon" />
              Contact Lens History
            </Label>
            <ButtonGroup
              options={['Yes', 'No', 'Sometimes']}
              value={formData.contactLensHistory}
              onChange={(value) => updateField('contactLensHistory', value)}
            />
          </div>
        );

      case 'eyeSurgeries':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Eye className="field-icon" />
              Past Eye Surgeries
            </Label>
            <EnhancedMultiEntryField
              options={eyeSurgeryOptions}
              value={formData.eyeSurgeries}
              onChange={(value) => updateField('eyeSurgeries', value)}
              placeholder="Type to search eye surgeries..."
              showEyeSelection={true}
              showDoctorField={true}
            />
          </div>
        );

      case 'eyeLasers':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Eye className="field-icon" />
              Eye Lasers
            </Label>
            <EnhancedMultiEntryField
              options={eyeLaserOptions}
              value={formData.eyeLasers}
              onChange={(value) => updateField('eyeLasers', value)}
              placeholder="Type to search eye lasers..."
              showEyeSelection={true}
              showDoctorField={true}
            />
          </div>
        );

      case 'eyeInjuries':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Eye className="field-icon" />
              Eye Injuries
            </Label>
            <ClickableOptions
              options={eyeInjuryOptions}
              value={formData.eyeInjuries}
              onChange={(value) => updateField('eyeInjuries', value)}
              label=""
              allowOther={true}
            />
          </div>
          );

      case 'eyeDrops':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Eye className="field-icon" />
              Eye Drops
            </Label>
            <ClickableOptions
              options={eyeMedicationOptions}
              value={formData.eyeDrops}
              onChange={(value) => updateField('eyeDrops', value)}
              label=""
              allowOther={true}
            />
          </div>
        );

      case 'eyeMedications':
        return (
          <div className="field-wrapper fade-in">
            <Label className="field-label">
              <Pill className="field-icon" />
              Eye Medications
            </Label>
            <MultiEntryField
              value={formData.eyeMedications}
              onChange={(value) => updateField('eyeMedications', value)}
              medicationOptions={eyeMedicationOptions}
            />
          </div>
        );

      case 'drugAllergies':
        return (
          <div className="field-wrapper fade-in">
            <DrugAllergiesField
              value={formData.drugAllergies}
              onChange={(value) => updateField('drugAllergies', value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const currentSectionData = sections[currentSection];
  const IconComponent = currentSectionData.icon;

  return (
    <div className="medical-form">
      {/* Header */}
      <div className="text-center mb-8 fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Eye className="w-8 h-8 text-primary logo-pulse" />
          <h1 className="text-3xl font-bold text-foreground">Imaginary Eye Institute</h1>
        </div>
        <p className="text-lg text-muted-foreground">Patient Registration & Intake Form</p>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2">
          {sections.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= currentSection ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Section */}
      <div className="form-section slide-in">
        <div className="form-section-header">
          <IconComponent className="section-icon" />
          <h2 className="form-section-title">{currentSectionData.title}</h2>
        </div>

        <div className="field-group">
          {currentSectionData.fields.map(fieldName => (
            <div key={fieldName}>
              {renderField(fieldName)}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevSection}
            disabled={currentSection === 0}
            className="slide-in"
          >
            Previous
          </Button>

          {currentSection === sections.length - 1 ? (
            <Button onClick={onSubmit} className="slide-in" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext} className="slide-in">
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};