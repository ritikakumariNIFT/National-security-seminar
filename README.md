# 🔐 National Security Seminar 2025 — Event Registration System

A production-grade event registration and ticketing system built with **Next.js**, deployable to **Vercel** in minutes.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Landing Page** | Animated hero, countdown timer, speaker profiles, agenda timeline |
| **Registration Form** | 9 fields, full client + server-side validation, spam/injection protection |
| **QR Ticket** | Auto-generated unique ticket with color QR code on submission |
| **Email Confirmation** | HTML + plain-text email via Resend API |
| **Database** | Supabase (Postgres) with Row Level Security, duplicate email detection |
| **Rate Limiting** | 3 registrations per IP per hour (in-memory; upgrade to Redis for scale) |
| **SQL Injection Protection** | Server-side sanitization strips HTML and SQL keywords |
| **Security Headers** | Content-type enforcement, method restrictions |

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1 — Push to GitHub

```bash
cd national-security-seminar
git init
git add .
git commit -m "Initial commit — NSS 2025 registration system"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/nss-2025.git
git push -u origin main
```

### Step 2 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy** (it will deploy in ~1 min — works in demo mode without env vars)

### Step 3 — Set Up Supabase (Database)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `supabase-schema.sql` → Run
3. Go to **Settings → API** → copy:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY`

### Step 4 — Set Up Resend (Email)

1. Create a free account at [resend.com](https://resend.com)
2. **Add & verify your domain** (or use `onboarding@resend.dev` for testing)
3. Create an API key → copy it → `RESEND_API_KEY`
4. Set `FROM_EMAIL` to your verified sender address

### Step 5 — Add Environment Variables to Vercel

In your Vercel project → **Settings → Environment Variables**, add:

```
SUPABASE_URL          = https://your-project.supabase.co
SUPABASE_ANON_KEY     = eyJhbGci...
RESEND_API_KEY        = re_abc123...
FROM_EMAIL            = nss@yourdomain.com
```

Then **Redeploy** (Deployments → ⋯ → Redeploy).

---

## 🛠 Local Development

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your keys
npm run dev
# Open http://localhost:3000
```

---

## 🗂 Project Structure

```
national-security-seminar/
├── pages/
│   ├── index.tsx          ← Main landing page
│   └── api/
│       └── register.ts    ← Registration API (validation + DB + email + QR)
├── components/
│   ├── RegistrationForm.tsx  ← Form with client-side validation
│   ├── Ticket.tsx            ← Ticket display with QR code
│   └── CountdownTimer.tsx    ← Live countdown
├── lib/
│   ├── validation.ts      ← Server-side validation + sanitization + rate limiting
│   └── email.ts           ← HTML & text email templates
├── styles/
│   └── globals.css        ← Theme, fonts, animations
├── supabase-schema.sql    ← Run this in Supabase SQL editor
└── .env.example           ← Environment variable template
```

---

## 🔒 Security Implementation

### SQL Injection Prevention
All user input passes through `sanitizeString()` in `lib/validation.ts`:
- Strips `< > ' "` characters
- Removes SQL keywords: `SELECT, INSERT, UPDATE, DROP, UNION`, etc.
- Length-limited to prevent buffer overflow attacks
- Strict enum validation for category/dietary fields

### Spam Protection
- **Rate limiting**: Max 3 registrations per IP per hour
- **Duplicate detection**: Unique constraint on email in database
- **Content-type enforcement**: Only accepts `application/json`
- **HTTP method restriction**: POST only

### Data Validation (Both Client & Server)
- Regex validation for email, phone numbers
- Character whitelist for names (letters, spaces, `.`, `-`, `'`)
- Length limits on all fields
- Boolean type enforcement for `agreeTerms`

---

## 📧 Email System

Uses [Resend](https://resend.com) — modern, developer-friendly, Vercel-native email API.

**Free tier**: 3,000 emails/month, 100/day — perfect for events.

The confirmation email includes:
- Delegate details
- Event date/venue
- Unique ticket ID
- QR code image (embedded base64)
- Security notice

---

## 🗄 Database Schema

The `registrations` table includes:
- `ticket_id` — unique `NSS25-XXXXXXXX` format
- `checked_in` + `checked_in_at` — for day-of verification
- Row Level Security (RLS) enabled
- A `registration_stats` view for admin dashboards

---

## 🎨 Design

- **Aesthetic**: Military intelligence / classified document — dark navy, gold accents, monospace type
- **Fonts**: Playfair Display (headings) + IBM Plex Mono (labels) + IBM Plex Sans (body)
- **Animations**: Staggered fade-up entrance, countdown timer, QR pulse
- **Mobile responsive** via CSS grid

---

## 📈 Scaling Notes

For higher-traffic events:
- Replace in-memory rate limiting with **Upstash Redis** (Vercel KV)
- Add **Vercel Edge Middleware** for geo-blocking
- Use **Supabase service role key** (server-only) instead of anon key
- Add **Turnstile** (Cloudflare) CAPTCHA to the form
