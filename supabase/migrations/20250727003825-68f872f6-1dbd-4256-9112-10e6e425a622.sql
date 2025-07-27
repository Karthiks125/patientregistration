-- Fix RLS policies for new columns
CREATE POLICY "Anyone can insert specialists_with_doctors" 
ON public.patient_registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view specialists_with_doctors" 
ON public.patient_registrations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert eye_injuries" 
ON public.patient_registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view eye_injuries" 
ON public.patient_registrations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert medical_conditions" 
ON public.patient_registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view medical_conditions" 
ON public.patient_registrations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert medications" 
ON public.patient_registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view medications" 
ON public.patient_registrations 
FOR SELECT 
USING (true);