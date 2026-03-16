interface TicketEmailData {
  ticketId: string
  fullName: string
  email: string
  organization: string
  designation: string
  category: string
  qrDataUrl: string
  registeredAt: string
}

const categoryLabels: Record<string, string> = {
  military: 'Armed Forces Personnel',
  civil: 'Civil Services / IFS',
  intelligence: 'Intelligence Agencies',
  academic: 'Academic / Think Tank',
  media: 'Accredited Media',
  international: 'International Delegate',
  industry: 'Defence Industry',
}

export function buildConfirmationEmail(data: TicketEmailData): { subject: string; html: string; text: string } {
  const subject = `[NSS 2025] Registration Confirmed — Ticket ${data.ticketId}`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>NSS 2025 — Ticket Confirmation</title>
<style>
  body { margin: 0; padding: 0; background: #0A0E1A; font-family: 'Courier New', monospace; color: #F0EDE8; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .header-bar { background: repeating-linear-gradient(90deg, #C0392B 0,#C0392B 20px, #1a0000 20px, #1a0000 40px); height: 8px; }
  .card { background: #111827; border: 1px solid rgba(201,168,76,0.3); padding: 40px; margin-bottom: 24px; }
  .gold { color: #C9A84C; }
  .slate { color: #8A9BB5; }
  .mono-small { font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; }
  .big-name { font-size: 28px; font-weight: 700; color: #F0EDE8; margin: 8px 0; }
  .divider { border: none; border-top: 1px solid rgba(201,168,76,0.2); margin: 24px 0; }
  .row { display: flex; justify-content: space-between; margin-bottom: 12px; }
  .label { color: #8A9BB5; font-size: 11px; letter-spacing: 0.2em; }
  .value { color: #F0EDE8; font-size: 13px; }
  .ticket-id { font-size: 20px; color: #C9A84C; letter-spacing: 0.2em; }
  .qr-section { text-align: center; padding: 24px; background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.15); margin-top: 24px; }
  .warning-box { background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.3); padding: 16px; font-size: 11px; color: rgba(229,115,115,0.9); letter-spacing: 0.05em; line-height: 1.7; margin-top: 24px; }
  .footer { text-align: center; padding: 24px 0; color: rgba(138,155,181,0.5); font-size: 10px; letter-spacing: 0.15em; }
</style>
</head>
<body>
<div class="header-bar"></div>
<div class="container">

  <div class="card">
    <div class="mono-small slate">United Services Institution of India</div>
    <div class="big-name">National Security Seminar <span class="gold">2025</span></div>
    <div class="mono-small gold" style="margin-top: 8px">Registration Confirmed</div>
    <hr class="divider"/>

    <div class="mono-small slate" style="margin-bottom: 6px">Delegate Name</div>
    <div style="font-size: 22px; color: #F0EDE8; margin-bottom: 24px;">${data.fullName}</div>

    <div class="row"><span class="label">Organization</span><span class="value">${data.organization}</span></div>
    <div class="row"><span class="label">Designation</span><span class="value">${data.designation}</span></div>
    <div class="row"><span class="label">Category</span><span class="value">${categoryLabels[data.category] || data.category}</span></div>
    <div class="row"><span class="label">Registered</span><span class="value">${new Date(data.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span></div>

    <hr class="divider"/>

    <div class="row">
      <div><span class="label" style="display: block; margin-bottom: 6px">Event Dates</span><span class="value">15–16 November 2025</span></div>
      <div><span class="label" style="display: block; margin-bottom: 6px">Venue</span><span class="value">USI, New Delhi</span></div>
    </div>

    <hr class="divider"/>

    <div class="mono-small slate" style="margin-bottom: 8px">Ticket Reference</div>
    <div class="ticket-id">${data.ticketId}</div>

    ${data.qrDataUrl ? `
    <div class="qr-section">
      <img src="${data.qrDataUrl}" alt="QR Code" width="140" height="140" style="image-rendering: pixelated;"/>
      <div class="mono-small slate" style="margin-top: 12px">Present this QR code at entry for identity verification</div>
    </div>
    ` : ''}

    <div class="warning-box">
      ⚠ SECURITY NOTICE: Carry a valid government-issued photo ID matching your registration details. This ticket is non-transferable. Your registration remains subject to security clearance verification.
    </div>
  </div>

  <div class="footer">
    UNITED SERVICES INSTITUTION OF INDIA · RAO TULA RAM MARG · NEW DELHI 110010<br/>
    © 2025 NSS — CONFIDENTIAL
  </div>

</div>
</body>
</html>
`

  const text = `
NATIONAL SECURITY SEMINAR 2025
United Services Institution of India
================================

REGISTRATION CONFIRMED

Delegate: ${data.fullName}
Ticket ID: ${data.ticketId}
Organization: ${data.organization}
Designation: ${data.designation}
Category: ${categoryLabels[data.category] || data.category}

Event: 15–16 November 2025
Venue: USI, Rao Tula Ram Marg, New Delhi 110010
Time: 0900 hours

Registered at: ${new Date(data.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

SECURITY NOTICE: Carry valid government-issued photo ID. Non-transferable.

USI National Security Seminar — Confidential
`

  return { subject, html, text }
}
