-- Drop trigger first
DROP TRIGGER IF EXISTS update_patient_registrations_updated_at ON public.patient_registrations;

-- Replace function with proper search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER update_patient_registrations_updated_at
BEFORE UPDATE ON public.patient_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();