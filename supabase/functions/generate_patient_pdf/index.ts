import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

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

    // Generate actual PDF using jsPDF
    const doc = new jsPDF();
    const lineHeight = 7;
    let yPosition = 20;
    
    // Helper function to add text with word wrap
    const addText = (text: string, x: number = 20, fontSize: number = 12, isBold: boolean = false) => {
      if (isBold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      doc.setFontSize(fontSize);
      
      const lines = doc.splitTextToSize(text, 170);
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, x, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 3; // Extra spacing after sections
    };

    // Title
    addText("👁️ Imaginary Eye Institute", 20, 18, true);
    addText("Patient Registration Summary", 20, 16, true);
    addText(`Generated on ${new Date().toLocaleDateString()}`, 20, 10);
    yPosition += 5;

    // Personal Information
    addText("PERSONAL INFORMATION", 20, 14, true);
    addText(`Name: ${patientData.firstName} ${patientData.lastName}`);
    addText(`Date of Birth: ${dobFormatted}`);
    addText(`Email: ${patientData.email}`);
    if (patientData.phone) addText(`Phone: ${patientData.phone}`);
    yPosition += 5;

    // Healthcare Providers
    addText("HEALTHCARE PROVIDERS", 20, 14, true);
    if (patientData.optometrist) addText(`Optometrist: ${patientData.optometrist}`);
    if (patientData.familyDoctor) addText(`Family Doctor: ${patientData.familyDoctor}`);
    if (patientData.specialists.length > 0) {
      addText(`Specialists: ${patientData.specialists.join(', ')}`);
    }
    yPosition += 5;

    // Eye History
    addText("EYE HISTORY", 20, 14, true);
    if (patientData.eyeDiseases.length > 0) {
      addText(`Eye Diseases: ${patientData.eyeDiseases.join(', ')}`);
    }
    if (patientData.contactLensHistory) {
      addText(`Contact Lens History: ${patientData.contactLensHistory}`);
    }
    if (patientData.eyeSurgeries.length > 0) {
      const surgeries = patientData.eyeSurgeries.map((surgery: any) => 
        typeof surgery === 'string' ? surgery : 
        `${surgery.name}${surgery.eye ? ` (${surgery.eye})` : ''}${surgery.doctor ? ` - Dr. ${surgery.doctor}` : ''}`
      ).join(', ');
      addText(`Eye Surgeries: ${surgeries}`);
    }
    if (patientData.eyeLasers.length > 0) {
      const lasers = patientData.eyeLasers.map((laser: any) => 
        typeof laser === 'string' ? laser : 
        `${laser.name}${laser.eye ? ` (${laser.eye})` : ''}${laser.doctor ? ` - Dr. ${laser.doctor}` : ''}`
      ).join(', ');
      addText(`Eye Lasers: ${lasers}`);
    }
    if (patientData.eyeInjuries.length > 0) {
      addText(`Eye Injuries: ${patientData.eyeInjuries.join(', ')}`);
    }
    yPosition += 5;

    // Medications
    addText("MEDICATIONS", 20, 14, true);
    if (patientData.eyeMedications.length > 0) {
      const eyeMeds = patientData.eyeMedications.map((med: any) => 
        `${med.medicationName} (${med.dosage}, ${med.affectedEye})`
      ).join(', ');
      addText(`Eye Medications: ${eyeMeds}`);
    }
    if (patientData.regularMedications.length > 0) {
      addText(`Regular Medications: ${patientData.regularMedications.join(', ')}`);
    }
    if (patientData.regularConditions.length > 0) {
      addText(`Medical Conditions: ${patientData.regularConditions.join(', ')}`);
    }
    if (patientData.drugAllergies.length > 0) {
      addText(`Drug Allergies: ${patientData.drugAllergies.join(', ')}`);
    }

    // Generate PDF as base64
    const pdfBytes = doc.output('arraybuffer');
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));
    
    // Send email using SendGrid
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured. Please set SENDGRID_API_KEY in Supabase secrets.');
    }

    const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL');
    const FROM_NAME = Deno.env.get('SENDGRID_FROM_NAME') || 'Imaginary Eye Institute';
    if (!FROM_EMAIL) {
      throw new Error('SendGrid from email not configured. Please set SENDGRID_FROM_EMAIL to a verified sender in SendGrid.');
    }

    const emailBody = {
      personalizations: [
        {
          to: [{ email: emailTo }],
          subject: `Patient Registration Summary - ${patientData.firstName} ${patientData.lastName}`
        }
      ],
      from: { 
        email: FROM_EMAIL, 
        name: FROM_NAME 
      },
      reply_to: patientData.email ? { email: patientData.email } : undefined,
      content: [
        {
          type: "text/html",
          value: htmlContent
        }
      ],
      attachments: [
        {
          content: pdfBase64,
          filename: `Patient_Registration_${patientData.firstName}_${patientData.lastName}.pdf`,
          type: "application/pdf",
          disposition: "attachment"
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