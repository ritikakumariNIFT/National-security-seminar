import type { NextApiRequest, NextApiResponse } from 'next'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'
import { validateRegistration, sanitizeString, checkRateLimit } from '../../lib/validation'
import { buildConfirmationEmail } from '../../lib/email'

// ── Supabase (optional) ──────────────────────────────────────────────────────
// Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel environment variables.
// If not set, registrations are processed in-memory (demo mode).
async function saveToDatabase(record: any) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log('[DB] Supabase not configured — skipping DB save (demo mode)')
    return
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase
      .from('registrations')
      .insert([{
        ticket_id: record.ticketId,
        full_name: record.fullName,
        email: record.email,
        phone: record.phone,
        organization: record.organization,
        designation: record.designation,
        category: record.category,
        dietary_requirements: record.dietaryRequirements || null,
        emergency_contact: record.emergencyContact || null,
        registered_at: record.registeredAt,
      }])

    if (error) {
      // Check for duplicate email
      if (error.code === '23505') {
        throw new Error('DUPLICATE_EMAIL')
      }
      console.error('[DB] Insert error:', error)
    }
  } catch (err: any) {
    if (err.message === 'DUPLICATE_EMAIL') throw err
    console.error('[DB] Supabase error:', err)
    // Don't block registration if DB fails — log and continue
  }
}

// ── Email sending via Resend ─────────────────────────────────────────────────
// Set RESEND_API_KEY and FROM_EMAIL in Vercel environment variables.
async function sendConfirmationEmail(emailData: any) {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL || 'nss@usi.org.in'

  if (!resendKey) {
    console.log('[EMAIL] Resend not configured — skipping email (demo mode)')
    return
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(resendKey)
    const { subject, html, text } = buildConfirmationEmail(emailData)

    await resend.emails.send({
      from: `NSS 2025 <${fromEmail}>`,
      to: [emailData.email],
      subject,
      html,
      text,
    })
    console.log(`[EMAIL] Sent to ${emailData.email}`)
  } catch (err) {
    console.error('[EMAIL] Send error:', err)
    // Don't block registration if email fails
  }
}

// ── Main Handler ─────────────────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting — max 3 registrations per IP per hour
  const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown').split(',')[0].trim()
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many registration attempts. Please try again later.' })
  }

  // CSRF / Content-Type check
  const contentType = req.headers['content-type'] || ''
  if (!contentType.includes('application/json')) {
    return res.status(400).json({ error: 'Invalid content type' })
  }

  // Validate
  const { valid, errors } = validateRegistration(req.body)
  if (!valid) {
    return res.status(422).json({ error: 'Validation failed', errors })
  }

  const body = req.body

  // Generate ticket ID
  const ticketId = `NSS25-${uuidv4().split('-')[0].toUpperCase()}`
  const registeredAt = new Date().toISOString()

  // Generate QR code (encodes ticket ID + name for verification)
  const qrPayload = JSON.stringify({
    id: ticketId,
    name: sanitizeString(body.fullName),
    event: 'NSS2025',
    ts: registeredAt,
  })

  let qrDataUrl = ''
  try {
    qrDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 2,
      color: {
        dark: '#0A0E1A',
        light: '#C9A84C',
      },
    })
  } catch (err) {
    console.error('[QR] Generation error:', err)
    // Don't block on QR failure
  }

  const record = {
    ticketId,
    fullName: sanitizeString(body.fullName),
    email: sanitizeString(body.email).toLowerCase(),
    phone: sanitizeString(body.phone),
    organization: sanitizeString(body.organization),
    designation: sanitizeString(body.designation),
    category: body.category,
    dietaryRequirements: body.dietaryRequirements || '',
    emergencyContact: sanitizeString(body.emergencyContact || ''),
    registeredAt,
    qrDataUrl,
  }

  // Save to DB
  try {
    await saveToDatabase(record)
  } catch (err: any) {
    if (err.message === 'DUPLICATE_EMAIL') {
      return res.status(409).json({ error: 'This email address is already registered for this event.' })
    }
  }

  // Send confirmation email (non-blocking)
  sendConfirmationEmail(record)

  // Return ticket data (don't send phone/emergency in response)
  return res.status(200).json({
    ticket: {
      ticketId: record.ticketId,
      fullName: record.fullName,
      email: record.email,
      organization: record.organization,
      designation: record.designation,
      category: record.category,
      qrDataUrl: record.qrDataUrl,
      registeredAt: record.registeredAt,
    },
  })
}
