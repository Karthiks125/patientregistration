import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { CalendarIcon, User, Mail, Phone, Stethoscope, Eye, Heart, Pill, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { MultiSelectField } from './MultiSelectField';
import { AutocompleteField } from './AutocompleteField';
import { ButtonGroup } from './ButtonGroup';
import * as medicalData from '@/data/medicalData';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  optometrist: z.string().optional(),
  familyDoctor: z.string().optional(),
  specialists: z.array(z.string()).default([]),
  eyeDiseases: z.array(z.string()).default([]),
  contactLensHistory: z.string().default(''),
  eyeSurgeries: z.array(z.string()).default([]),
  eyeDrops: z.array(z.string()).default([]),
  systemicDiseases: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  drugAllergies: z.array(z.string()).default([])
});

type FormData = z.infer<typeof formSchema>;

export const MedicalIntakeForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      optometrist: '',
      familyDoctor: '',
      specialists: [],
      eyeDiseases: [],
      contactLensHistory: '',
      eyeSurgeries: [],
      eyeDrops: [],
      systemicDiseases: [],
      medications: [],
      drugAllergies: []
    }
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
      fields: ['optometrist', 'familyDoctor', 'specialists']
    },
    {
      title: 'Eye History',
      icon: Eye,
      fields: ['eyeDiseases', 'contactLensHistory', 'eyeSurgeries', 'eyeDrops']
    },
    {
      title: 'Systemic Diseases',
      icon: Heart,
      fields: ['systemicDiseases']
    },
    {
      title: 'Medications and Allergies',
      icon: Pill,
      fields: ['medications', 'drugAllergies']
    }
  ];

  const nextSection = () => {
    const currentFields = sections[currentSection].fields;
    const hasErrors = currentFields.some(field => form.formState.errors[field as keyof FormData]);
    
    if (!hasErrors) {
      setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
    } else {
      toast({
        title: "Please fix errors before continuing",
        variant: "destructive"
      });
    }
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    toast({
      title: "Form submitted successfully!",
      description: "Your medical intake form has been received."
    });
  };

  const renderField = (fieldName: string) => {
    switch (fieldName) {
      case 'firstName':
        return (
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <User className="field-icon" />
                  First Name <span className="required-indicator">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'lastName':
        return (
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <User className="field-icon" />
                  Last Name <span className="required-indicator">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'dateOfBirth':
        return (
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <CalendarIcon className="field-icon" />
                  Date of Birth <span className="required-indicator">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'email':
        return (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Mail className="field-icon" />
                  Email Address <span className="required-indicator">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'phone':
        return (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Phone className="field-icon" />
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'optometrist':
        return (
          <FormField
            control={form.control}
            name="optometrist"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Stethoscope className="field-icon" />
                  Current Optometrist
                </FormLabel>
                <FormControl>
                  <AutocompleteField
                    options={medicalData.commonOptometrists}
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Type to search optometrists..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'familyDoctor':
        return (
          <FormField
            control={form.control}
            name="familyDoctor"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Stethoscope className="field-icon" />
                  Family Doctor
                </FormLabel>
                <FormControl>
                  <AutocompleteField
                    options={medicalData.commonFamilyDoctors}
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Type to search family doctors..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'specialists':
        return (
          <FormField
            control={form.control}
            name="specialists"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Stethoscope className="field-icon" />
                  Other Specialists
                </FormLabel>
                <FormControl>
                  <MultiSelectField
                    options={medicalData.specialties}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type to search specialists..."
                    allowCustom={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'eyeDiseases':
        return (
          <FormField
            control={form.control}
            name="eyeDiseases"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Eye className="field-icon" />
                  Eye Diseases
                </FormLabel>
                <FormControl>
                  <MultiSelectField
                    options={medicalData.eyeDiseases}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type to search eye diseases..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'contactLensHistory':
        return (
          <FormField
            control={form.control}
            name="contactLensHistory"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Eye className="field-icon" />
                  Contact Lens History
                </FormLabel>
                <FormControl>
                  <ButtonGroup
                    options={['Yes', 'No', 'Sometimes']}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'eyeSurgeries':
        return (
          <FormField
            control={form.control}
            name="eyeSurgeries"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Eye className="field-icon" />
                  Past Eye Surgeries
                </FormLabel>
                <FormControl>
                  <MultiSelectField
                    options={medicalData.eyeSurgeries}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type to search eye surgeries..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'eyeDrops':
        return (
          <FormField
            control={form.control}
            name="eyeDrops"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Pill className="field-icon" />
                  Eye Drops
                </FormLabel>
                <FormControl>
                  <MultiSelectField
                    options={medicalData.eyeDrops}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type to search eye drops..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'systemicDiseases':
        return (
          <FormField
            control={form.control}
            name="systemicDiseases"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Heart className="field-icon" />
                  Systemic Diseases
                </FormLabel>
                <FormControl>
                  <MultiSelectField
                    options={medicalData.systemicDiseases}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type to search diseases..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'medications':
        return (
          <FormField
            control={form.control}
            name="medications"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <Pill className="field-icon" />
                  Current Medications
                </FormLabel>
                <FormControl>
                  <MultiSelectField
                    options={medicalData.medications}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type to search medications..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'drugAllergies':
        return (
          <FormField
            control={form.control}
            name="drugAllergies"
            render={({ field }) => (
              <FormItem className="field-wrapper fade-in">
                <FormLabel className="field-label">
                  <AlertTriangle className="field-icon" />
                  Drug Allergies
                </FormLabel>
                <FormControl>
                  <MultiSelectField
                    options={medicalData.drugAllergies}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type to search drug allergies..."
                    allowCustom={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index <= currentSection ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Button type="submit" className="slide-in">
                  Submit Form
                </Button>
              ) : (
                <Button type="button" onClick={nextSection} className="slide-in">
                  Next
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};