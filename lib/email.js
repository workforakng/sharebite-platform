export async function sendEmail({ to, subject, text }) {
  console.log('----------------------------------------------------');
  console.log(`[MOCK EMAIL SENT]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${text}`);
  console.log('----------------------------------------------------');
  // In production, integrate Resend, SendGrid, or AWS SES here
  return true;
}
