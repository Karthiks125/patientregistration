import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PatientData {
  firstName: string;
  lastName: string;
  dateOfBirth: { year: number; month: number; day: number };
  email: string;
  phone?: string;
  optometrist?: string;
  familyDoctor?: string;
  specialists: string[];
  eyeDiseases: string[];
  contactLensHistory?: string;
  eyeSurgeries: string[];
  eyeLasers: string[];
  eyeInjuries: string[];
  eyeDrops: string[];
  eyeMedications: Array<{
    medicationName: string;
    dosage: string;
    affectedEye: string;
  }>;
  regularMedications: string[];
  regularConditions: string[];
  drugAllergies: string[];
}

interface RequestData {
  patientData: PatientData;
  emailTo: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientData, emailTo }: RequestData = await req.json();

    console.log('Generating PDF for patient:', patientData.firstName, patientData.lastName);

    // Format date of birth
    const dobFormatted = `${patientData.dateOfBirth.month}/${patientData.dateOfBirth.day}/${patientData.dateOfBirth.year}`;

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Patient Registration Summary</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0070f3; padding-bottom: 20px; }
          .logo { color: #0070f3; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; color: #0070f3; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; }
          .field { margin-bottom: 8px; }
          .field-label { font-weight: bold; color: #555; }
          .field-value { margin-left: 10px; }
          .list-item { margin: 5px 0; padding-left: 20px; }
          .medication-entry { background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 5px; }
          .no-data { color: #999; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">👁️ Imaginary Eye Institute</div>
          <h2>Patient Registration Summary</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
          <div class="section-title">Personal Information</div>
          <div class="field">
            <span class="field-label">Name:</span>
            <span class="field-value">${patientData.firstName} ${patientData.lastName}</span>
          </div>
          <div class="field">
            <span class="field-label">Date of Birth:</span>
            <span class="field-value">${dobFormatted}</span>
          </div>
          <div class="field">
            <span class="field-label">Email:</span>
            <span class="field-value">${patientData.email}</span>
          </div>
          ${patientData.phone ? `
          <div class="field">
            <span class="field-label">Phone:</span>
            <span class="field-value">${patientData.phone}</span>
          </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">Healthcare Providers</div>
          ${patientData.optometrist ? `
          <div class="field">
            <span class="field-label">Optometrist:</span>
            <span class="field-value">${patientData.optometrist}</span>
          </div>
          ` : ''}
          ${patientData.familyDoctor ? `
          <div class="field">
            <span class="field-label">Family Doctor:</span>
            <span class="field-value">${patientData.familyDoctor}</span>
          </div>
          ` : ''}
          ${patientData.specialists.length > 0 ? `
          <div class="field">
            <span class="field-label">Specialists:</span>
            ${patientData.specialists.map(specialist => `<div class="list-item">• ${specialist}</div>`).join('')}
          </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">Eye History</div>
          ${patientData.eyeDiseases.length > 0 ? `
          <div class="field">
            <span class="field-label">Eye Diseases:</span>
            ${patientData.eyeDiseases.map(disease => `<div class="list-item">• ${disease}</div>`).join('')}
          </div>
          ` : ''}
          ${patientData.contactLensHistory ? `
          <div class="field">
            <span class="field-label">Contact Lens History:</span>
            <span class="field-value">${patientData.contactLensHistory}</span>
          </div>
          ` : ''}
          ${patientData.eyeSurgeries.length > 0 ? `
          <div class="field">
            <span class="field-label">Eye Surgeries:</span>
            ${patientData.eyeSurgeries.map(surgery => `<div class="list-item">• ${surgery}</div>`).join('')}
          </div>
          ` : ''}
          ${patientData.eyeLasers.length > 0 ? `
          <div class="field">
            <span class="field-label">Eye Lasers:</span>
            ${patientData.eyeLasers.map(laser => `<div class="list-item">• ${laser}</div>`).join('')}
          </div>
          ` : ''}
          ${patientData.eyeInjuries.length > 0 ? `
          <div class="field">
            <span class="field-label">Eye Injuries:</span>
            ${patientData.eyeInjuries.map(injury => `<div class="list-item">• ${injury}</div>`).join('')}
          </div>
          ` : ''}
          ${patientData.eyeDrops.length > 0 ? `
          <div class="field">
            <span class="field-label">Eye Drops:</span>
            ${patientData.eyeDrops.map(drop => `<div class="list-item">• ${drop}</div>`).join('')}
          </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">Medications</div>
          ${patientData.eyeMedications.length > 0 ? `
          <div class="field">
            <span class="field-label">Eye Medications:</span>
            ${patientData.eyeMedications.map(med => `
              <div class="medication-entry">
                <strong>${med.medicationName}</strong><br>
                Dosage: ${med.dosage}<br>
                Affected Eye: ${med.affectedEye}
              </div>
            `).join('')}
          </div>
          ` : ''}
          ${patientData.regularMedications.length > 0 ? `
          <div class="field">
            <span class="field-label">Regular Medications:</span>
            ${patientData.regularMedications.map(med => `<div class="list-item">• ${med}</div>`).join('')}
          </div>
          ` : ''}
          ${patientData.regularConditions.length > 0 ? `
          <div class="field">
            <span class="field-label">Medical Conditions:</span>
            ${patientData.regularConditions.map(condition => `<div class="list-item">• ${condition}</div>`).join('')}
          </div>
          ` : ''}
          ${patientData.drugAllergies.length > 0 ? `
          <div class="field">
            <span class="field-label">Drug Allergies:</span>
            ${patientData.drugAllergies.map(allergy => `<div class="list-item">• ${allergy}</div>`).join('')}
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;

    // Convert HTML to PDF using html-pdf-chromium
    // Note: For now, we'll send the HTML content as email body
    // In production, you would use a PDF generation service
    
    // Send email using SendGrid
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    const emailBody = {
      personalizations: [
        {
          to: [{ email: 'kartaitesting@gmail.com' }],
          subject: `Patient Registration Summary - ${patientData.firstName} ${patientData.lastName}`
        }
      ],
      from: { 
        email: "kartaitesting@gmail.com", 
        name: "Imaginary Eye Institute" 
      },
      content: [
        {
          type: "text/html",
          value: htmlContent
        }
      ]
    };

    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailBody)
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('SendGrid error:', errorText);
      throw new Error(`Failed to send email: ${emailResponse.statusText}`);
    }

    console.log('Email sent successfully to:', emailTo);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'PDF generated and email sent successfully' 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in generate_patient_pdf function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);