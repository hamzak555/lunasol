import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...formData } = body;

    // Validate required fields
    if (!formData.name || !formData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Build email content based on form type
    let subject = '';
    let htmlContent = '';

    if (type === 'contact') {
      subject = `Contact Form: ${formData.subject || 'General Inquiry'}`;
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="color-scheme" content="light only">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #1F1F1F;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1F1F1F;">
            <tr>
              <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; width: 100%; background-color: #2C2C2C; border: 3px solid #806D4B; border-radius: 8px;">

                  <!-- Header -->
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #2C2C2C; border-bottom: 2px solid #806D4B;">
                      <h1 style="margin: 0; color: #806D4B; font-family: Georgia, serif; font-size: 28px; font-weight: bold; letter-spacing: 2px;">
                        NEW CONTACT MESSAGE
                      </h1>
                      <p style="margin: 10px 0 0; color: #DCD3B8; font-size: 14px; opacity: 0.9;">
                        ${formData.subject || 'General Inquiry'}
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px; background-color: #2C2C2C;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #806D4B;">
                            <p style="margin: 0 0 5px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">NAME</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 16px; line-height: 24px;">${formData.name}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #806D4B;">
                            <p style="margin: 0 0 5px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">EMAIL</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 16px; line-height: 24px;">
                              <a href="mailto:${formData.email}" style="color: #DCD3B8; text-decoration: none;">${formData.email}</a>
                            </p>
                          </td>
                        </tr>
                        ${formData.phone ? `
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #806D4B;">
                            <p style="margin: 0 0 5px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">PHONE</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 16px; line-height: 24px;">${formData.phone}</p>
                          </td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="padding: 15px 0;">
                            <p style="margin: 0 0 10px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">MESSAGE</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 15px; line-height: 23px; white-space: pre-wrap;">${formData.message}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px; text-align: center; background-color: #1F1F1F; border-top: 2px solid #806D4B;">
                      <p style="margin: 0; color: #DCD3B8; font-size: 12px; opacity: 0.7;">
                        Contact form submission from lunasol-miami.com
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    } else if (type === 'private-booking') {
      subject = `Private Booking Request: ${formData.eventType || 'Event'}`;
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="color-scheme" content="light only">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #1F1F1F;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1F1F1F;">
            <tr>
              <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; width: 100%; background-color: #2C2C2C; border: 3px solid #806D4B; border-radius: 8px;">

                  <!-- Header -->
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #2C2C2C; border-bottom: 2px solid #806D4B;">
                      <h1 style="margin: 0; color: #806D4B; font-family: Georgia, serif; font-size: 28px; font-weight: bold; letter-spacing: 2px;">
                        PRIVATE BOOKING REQUEST
                      </h1>
                      <p style="margin: 10px 0 0; color: #DCD3B8; font-size: 14px; opacity: 0.9;">
                        ${formData.eventType || 'Private Event'}
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px; background-color: #2C2C2C;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #806D4B;">
                            <p style="margin: 0 0 5px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">NAME</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 16px; line-height: 24px;">${formData.name}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #806D4B;">
                            <p style="margin: 0 0 5px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">EMAIL</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 16px; line-height: 24px;">
                              <a href="mailto:${formData.email}" style="color: #DCD3B8; text-decoration: none;">${formData.email}</a>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #806D4B;">
                            <p style="margin: 0 0 5px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">PHONE</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 16px; line-height: 24px;">${formData.phone}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #806D4B;">
                            <p style="margin: 0 0 5px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">EVENT DATE</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 16px; line-height: 24px;">${formData.eventDate || 'Not specified'}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #806D4B;">
                            <p style="margin: 0 0 5px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">GUEST COUNT</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 16px; line-height: 24px;">${formData.guestCount}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #806D4B;">
                            <p style="margin: 0 0 5px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">EVENT TYPE</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 16px; line-height: 24px;">${formData.eventType}</p>
                          </td>
                        </tr>
                        ${formData.message ? `
                        <tr>
                          <td style="padding: 15px 0;">
                            <p style="margin: 0 0 10px; color: #806D4B; font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 1px;">ADDITIONAL DETAILS</p>
                            <p style="margin: 0; color: #DCD3B8; font-size: 15px; line-height: 23px; white-space: pre-wrap;">${formData.message}</p>
                          </td>
                        </tr>
                        ` : ''}
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px; text-align: center; background-color: #1F1F1F; border-top: 2px solid #806D4B;">
                      <p style="margin: 0; color: #DCD3B8; font-size: 12px; opacity: 0.7;">
                        Private booking request from lunasol-miami.com
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    } else {
      return NextResponse.json(
        { error: 'Invalid form type' },
        { status: 400 }
      );
    }

    // Send email via Resend
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';
    const data = await resend.emails.send({
      from: `Lunasol Miami <${fromEmail}>`,
      to: process.env.RESEND_TO_EMAIL || 'info@lunasol-miami.com',
      subject: subject,
      html: htmlContent,
      replyTo: formData.email,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
