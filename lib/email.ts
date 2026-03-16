import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const FROM = 'Ourika Travels <onboarding@resend.dev>';

export async function sendReviewRequestEmail({
  to,
  touristName,
  trekTitle,
  reviewToken,
  bookingRef,
  trekDate,
}: {
  to: string;
  touristName: string;
  trekTitle: string;
  reviewToken: string;
  bookingRef: string;
  trekDate: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY');
  }

  const reviewUrl = `${APP_URL}/review/${reviewToken}`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `How was your trek? Share your experience — ${trekTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f8faf8;font-family:sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

          <div style="background:#0b3a2c;border-radius:20px;padding:32px;
            text-align:center;margin-bottom:24px;">
            <div style="width:56px;height:56px;background:#00ef9d;border-radius:14px;
              display:inline-flex;align-items:center;justify-content:center;
              margin-bottom:16px;">
              <span style="font-size:22px;font-weight:900;color:#0b3a2c;">OT</span>
            </div>
            <h1 style="color:white;font-size:24px;font-weight:900;margin:0;
              letter-spacing:-0.5px;">
              Ourika Travels
            </h1>
            <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:8px 0 0;">
              Authentic experiences in the Atlas Mountains
            </p>
          </div>

          <div style="background:white;border-radius:20px;padding:32px;
            border:1px solid #e5e7eb;">
            <h2 style="color:#0b3a2c;font-size:22px;font-weight:900;
              margin:0 0 8px;">
              How was your trek, ${touristName}?
            </h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
              You recently completed <strong style="color:#0b3a2c;">${trekTitle}</strong>
              on ${trekDate}. We'd love to hear about your experience — your
              review helps other travelers discover authentic Ourika Valley adventures.
            </p>

            <div style="text-align:center;margin:24px 0;">
              <span style="font-size:32px;">⭐⭐⭐⭐⭐</span>
            </div>

            <div style="text-align:center;margin:24px 0;">
              <a href="${reviewUrl}"
                style="display:inline-block;background:#0b3a2c;color:white;
                padding:16px 40px;border-radius:100px;font-size:16px;
                font-weight:900;text-decoration:none;letter-spacing:-0.3px;">
                Share your experience →
              </a>
            </div>

            <p style="color:#9ca3af;font-size:12px;text-align:center;margin:16px 0 0;">
              Booking ref: ${bookingRef} · This link expires in 30 days
            </p>
          </div>

          <div style="text-align:center;padding:24px 0;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              Ourika Travels · Setti Fatma, Ourika Valley, Morocco<br/>
              <a href="${APP_URL}" style="color:#0b3a2c;">ourikatravels.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

