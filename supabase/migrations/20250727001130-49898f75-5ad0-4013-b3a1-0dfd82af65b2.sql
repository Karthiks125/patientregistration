-- Create patient_registrations table
CREATE TABLE public.patient_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth JSONB NOT NULL, -- {year: number, month: number, day: number}
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Healthcare Providers
  optometrist TEXT,
  family_doctor TEXT,
  specialists JSONB DEFAULT '[]'::jsonb, -- array of strings
  
  -- Eye History
  eye_diseases JSONB DEFAULT '[]'::jsonb, -- array of strings
  contact_lens_history TEXT,
  eye_surgeries JSONB DEFAULT '[]'::jsonb, -- array of strings
  eye_lasers JSONB DEFAULT '[]'::jsonb, -- array of strings
  eye_injuries JSONB DEFAULT '[]'::jsonb, -- array of strings
  eye_drops JSONB DEFAULT '[]'::jsonb, -- array of strings
  
  -- Medications
  eye_medications JSONB DEFAULT '[]'::jsonb, -- array of {medicationName, dosage, affectedEye}
  regular_medications JSONB DEFAULT '[]'::jsonb, -- array of strings
  regular_conditions JSONB DEFAULT '[]'::jsonb, -- array of strings
  drug_allergies JSONB DEFAULT '[]'::jsonb, -- array of strings
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patient_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a registration form)
CREATE POLICY "Anyone can insert patient registrations" 
ON public.patient_registrations 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view patient registrations" 
ON public.patient_registrations 
FOR SELECT 
TO public
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_patient_registrations_updated_at
BEFORE UPDATE ON public.patient_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();