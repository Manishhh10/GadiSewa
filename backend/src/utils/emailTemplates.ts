import { env } from '../config/env';

const wrap = (headerColor: string, icon: string, title: string, subtitle: string, body: string) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f3f3f3;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
    <div style="background:${headerColor};color:#fff;padding:36px;text-align:center;">
      <p style="font-size:20px;font-weight:800;margin:0 0 12px;">GadiSewa</p>
      <div style="font-size:36px;">${icon}</div>
      <h1 style="font-size:22px;margin:12px 0 4px;">${title}</h1>
      <p style="opacity:.9;margin:0;">${subtitle}</p>
    </div>
    <div style="padding:28px 32px;">${body}</div>
    <div style="background:#f7f7f7;padding:18px;text-align:center;color:#777;font-size:13px;">
      © ${new Date().getFullYear()} GadiSewa Nepal · Kathmandu
    </div>
  </div>
</div>`;

const row = (label: string, value: string) =>
  `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:15px;">
     <span style="color:#666;">${label}</span><span style="font-weight:600;color:#222;">${value}</span>
   </div>`;

const button = (href: string, label: string) =>
  `<a href="${href}" style="display:block;text-align:center;background:#ff6b00;color:#fff;padding:14px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:20px;">${label}</a>`;

export function bookingConfirmationEmail(params: {
  vehicleName: string;
  bookingRef: string;
  pickupDate: string;
  returnDate: string;
  totalAmount: number;
}) {
  const body = `
    <p style="font-size:15px;color:#222;">Your payment was successful and your booking is confirmed. Here are the details:</p>
    <div style="background:#fafafa;border-radius:12px;padding:18px;margin:16px 0;">
      ${row('Vehicle', params.vehicleName)}
      ${row('Booking Ref', params.bookingRef)}
      ${row('Trip Dates', `${params.pickupDate} – ${params.returnDate}`)}
      <div style="display:flex;justify-content:space-between;padding-top:12px;font-size:18px;font-weight:700;">
        <span>Total Paid</span><span style="color:#ff6b00;">Rs. ${params.totalAmount.toLocaleString()}</span>
      </div>
    </div>
    ${button(`${env.CLIENT_URL}/bookings`, 'View My Booking')}
  `;
  return wrap('#ff6b00', '✅', 'Booking Confirmed!', 'Your vehicle is reserved and ready.', body);
}

export function vendorApprovedEmail() {
  const body = `
    <p style="font-size:15px;color:#222;">Congratulations! Your vendor application has been approved. You can now list your vehicles and start earning.</p>
    <ul style="font-size:15px;color:#222;padding-left:20px;">
      <li>List unlimited vehicles</li>
      <li>Manage bookings from your dashboard</li>
      <li>Get paid securely via eSewa</li>
    </ul>
    ${button(`${env.CLIENT_URL}/vendor/add-vehicle`, 'List Your First Vehicle')}
  `;
  return wrap('#2e7d32', '🎉', "You're a Verified Vendor!", 'Welcome to the GadiSewa partner network.', body);
}

export function vendorRejectedEmail(reason: string) {
  const body = `
    <p style="font-size:15px;color:#222;">Thanks for your interest in becoming a GadiSewa vendor. Unfortunately, we're not able to approve your application at this time.</p>
    <div style="background:#fdf2f2;border-left:4px solid #d32f2f;border-radius:8px;padding:14px 16px;margin:16px 0;">
      <p style="font-size:13px;color:#888;margin:0 0 4px;text-transform:uppercase;letter-spacing:.04em;">Reason</p>
      <p style="font-size:15px;color:#222;margin:0;">${reason}</p>
    </div>
    <p style="font-size:15px;color:#222;">You're welcome to address the issue above and submit a new application.</p>
    ${button(`${env.CLIENT_URL}/vendor/apply`, 'Apply Again')}
  `;
  return wrap('#d32f2f', 'ℹ️', 'Application Update', 'Your GadiSewa vendor application', body);
}
