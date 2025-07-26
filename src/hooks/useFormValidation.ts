import { useState } from 'react';

export interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  email: string;
  phone: string;

  // Healthcare Providers
  optometrist: string;
  familyDoctor: string;
  specialists: string[];

  // Eye History
  eyeDiseases: string[];
  contactLensHistory: string;
  eyeSurgeries: string[];
  eyeDrops: string[];

  // Systemic Diseases
  systemicDiseases: string[];

  // Medications and Allergies
  medications: string[];
  drugAllergies: string[];
}

export interface FormErrors {
  [key: string]: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (data: FormData): boolean => {
    const newErrors: FormErrors = {};

    // Required field validations
    if (!data.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    errors,
    validateForm,
    clearError,
    setErrors
  };
};