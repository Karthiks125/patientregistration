import React, { useEffect, useState } from 'react';
import { MedicalIntakeForm } from '@/components/medical-form/MedicalIntakeForm';

const Index = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check if redirected with success parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccess(true);
      
      // Remove the success parameter from URL
      window.history.replaceState({}, document.title, '/');
      
      // Hide success message after 7 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 7000);
    }
  }, []);

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 text-white text-center">
        <div className="text-6xl mb-4">✅</div>
        <div className="text-3xl mb-4 font-bold">We have received all your details</div>
        <div className="text-xl max-w-2xl px-4">
          They have been successfully added to your file. You’ll be redirected shortly.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <MedicalIntakeForm />
    </div>
  );
};

export default Index;
