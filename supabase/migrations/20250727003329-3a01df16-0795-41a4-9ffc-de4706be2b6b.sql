-- Add eye_injuries column to patient_registrations table
ALTER TABLE public.patient_registrations 
ADD COLUMN IF NOT EXISTS eye_injuries jsonb DEFAULT '[]'::jsonb;

-- Add specialists column with doctor names support
ALTER TABLE public.patient_registrations 
ADD COLUMN IF NOT EXISTS specialists_with_doctors jsonb DEFAULT '[]'::jsonb;

-- Update drug_allergies to support free text entries
-- The existing drug_allergies column already supports jsonb, so no changes needed

-- Add medical_conditions column (renamed from regular_conditions)
ALTER TABLE public.patient_registrations 
ADD COLUMN IF NOT EXISTS medical_conditions jsonb DEFAULT '[]'::jsonb;

-- Add medications column (renamed from regular_medications) 
ALTER TABLE public.patient_registrations 
ADD COLUMN IF NOT EXISTS medications jsonb DEFAULT '[]'::jsonb;

-- Remove old columns if they exist and copy data
UPDATE patient_registrations 
SET medical_conditions = regular_conditions 
WHERE regular_conditions IS NOT NULL;

UPDATE patient_registrations 
SET medications = regular_medications 
WHERE regular_medications IS NOT NULL;