import { useState } from 'react'

interface FormData {
  fullName: string
  email: string
  phone: string
  organization: string
  designation: string
  category: string
  dietaryRequirements: string
  emergencyContact: string
  agreeTerms: boolean
}

interface FormErrors {
  [key: string]: string
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(201,168,76,0.25)',
  color: 'var(--white)',
  padding: '14px 16px',
  fontFamily: 'var(--font-body)',
  fontSize: '15px',
  transition: 'border-color 0.2s',
  borderRadius: 0,
  appearance: 'none' as const,
}

const labelStyle = {
  display: 'block' as const,
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--slate)',
  letterSpacing: '0.15em',
  marginBottom: '8px',
}

const errorStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: '#E57373',
  marginTop: '6px',
  letterSpacing: '0.05em',
}

export default function RegistrationForm({ onSuccess }: { onSuccess: (ticket: any) => void }) {
  const [form, setForm] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    category: '',
    dietaryRequirements: '',
    emergencyContact: '',
    agreeTerms: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [focusedField, setFocusedField] = useState('')

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    // Full name
    if (!form.fullName.trim()) {
      newErrors.fullName = 'FULL NAME IS REQUIRED'
    } else if (form.fullName.trim().length < 3) {
      newErrors.fullName = 'NAME MUST BE AT LEAST 3 CHARACTERS'
    } else if (!/^[a-zA-Z\s.\-']+$/.test(form.fullName.trim())) {
      newErrors.fullName = 'NAME CONTAINS INVALID CHARACTERS'
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = 'EMAIL ADDRESS IS REQUIRED'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'INVALID EMAIL FORMAT'
    }

    // Phone
    if (!form.phone.trim()) {
      newErrors.phone = 'PHONE NUMBER IS REQUIRED'
    } else if (!/^[+\d\s\-()]{8,20}$/.test(form.phone.trim())) {
      newErrors.phone = 'INVALID PHONE FORMAT'
    }

    // Organization
    if (!form.organization.trim()) {
      newErrors.organization = 'ORGANIZATION IS REQUIRED'
    } else if (form.organization.trim().length < 2) {
      newErrors.organization = 'PLEASE ENTER FULL ORGANIZATION NAME'
    }

    // Designation
    if (!form.designation.trim()) {
      newErrors.designation = 'DESIGNATION / RANK IS REQUIRED'
    }

    // Category
    if (!form.category) {
      newErrors.category = 'PLEASE SELECT DELEGATE CATEGORY'
    }

    // Emergency contact
    if (form.emergencyContact && !/^[+\d\s\-()]{8,20}$/.test(form.emergencyContact.trim())) {
      newErrors.emergencyContact = 'INVALID EMERGENCY CONTACT FORMAT'
    }

    // Terms
    if (!form.agreeTerms) {
      newErrors.agreeTerms = 'YOU MUST AGREE TO THE SECURITY PROTOCOLS'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error || 'Registration failed. Please try again.')
      } else {
        onSuccess(data.ticket)
      }
    } catch {
      setServerError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const fieldFocusStyle = (name: string) => ({
    ...inputStyle,
    borderColor: errors[name] ? '#E57373' : focusedField === name ? 'var(--gold)' : 'rgba(201,168,76,0.25)',
  })

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Security classification notice */}
      <div style={{
        border: '1px solid rgba(192,57,43,0.4)',
        padding: '16px 20px',
        marginBottom: '40px',
        background: 'rgba(192,57,43,0.06)',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start'
      }}>
        <div style={{ color: '#E57373', fontFamily: 'var(--font-mono)', fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>⚠</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(229,115,115,0.9)', letterSpacing: '0.08em', lineHeight: 1.7 }}>
          THIS REGISTRATION FORM IS ENCRYPTED. PROVIDING FALSE INFORMATION IS A VIOLATION OF THE OFFICIAL SECRETS ACT. ALL SUBMISSIONS ARE VERIFIED PRIOR TO CLEARANCE.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Full Name */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>FULL NAME *</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            onFocus={() => setFocusedField('fullName')}
            onBlur={() => setFocusedField('')}
            placeholder="As per official identification"
            style={fieldFocusStyle('fullName')}
            autoComplete="name"
          />
          {errors.fullName && <div style={errorStyle}>↳ {errors.fullName}</div>}
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>EMAIL ADDRESS *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            placeholder="official@organization.gov"
            style={fieldFocusStyle('email')}
            autoComplete="email"
          />
          {errors.email && <div style={errorStyle}>↳ {errors.email}</div>}
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle}>PHONE NUMBER *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField('')}
            placeholder="+91 98765 43210"
            style={fieldFocusStyle('phone')}
            autoComplete="tel"
          />
          {errors.phone && <div style={errorStyle}>↳ {errors.phone}</div>}
        </div>

        {/* Organization */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>ORGANIZATION / UNIT *</label>
          <input
            type="text"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            onFocus={() => setFocusedField('organization')}
            onBlur={() => setFocusedField('')}
            placeholder="Ministry, Service Branch, or Institution"
            style={fieldFocusStyle('organization')}
          />
          {errors.organization && <div style={errorStyle}>↳ {errors.organization}</div>}
        </div>

        {/* Designation */}
        <div>
          <label style={labelStyle}>DESIGNATION / RANK *</label>
          <input
            type="text"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            onFocus={() => setFocusedField('designation')}
            onBlur={() => setFocusedField('')}
            placeholder="e.g. Brigadier, Joint Secretary"
            style={fieldFocusStyle('designation')}
          />
          {errors.designation && <div style={errorStyle}>↳ {errors.designation}</div>}
        </div>

        {/* Category */}
        <div>
          <label style={labelStyle}>DELEGATE CATEGORY *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            onFocus={() => setFocusedField('category')}
            onBlur={() => setFocusedField('')}
            style={{
              ...fieldFocusStyle('category'),
              cursor: 'pointer',
            }}
          >
            <option value="" style={{ background: '#111827' }}>Select Category</option>
            <option value="military" style={{ background: '#111827' }}>Armed Forces Personnel</option>
            <option value="civil" style={{ background: '#111827' }}>Civil Services / IFS</option>
            <option value="intelligence" style={{ background: '#111827' }}>Intelligence Agencies</option>
            <option value="academic" style={{ background: '#111827' }}>Academic / Think Tank</option>
            <option value="media" style={{ background: '#111827' }}>Accredited Media</option>
            <option value="international" style={{ background: '#111827' }}>International Delegate</option>
            <option value="industry" style={{ background: '#111827' }}>Defence Industry</option>
          </select>
          {errors.category && <div style={errorStyle}>↳ {errors.category}</div>}
        </div>

        {/* Dietary */}
        <div>
          <label style={labelStyle}>DIETARY REQUIREMENTS</label>
          <select
            name="dietaryRequirements"
            value={form.dietaryRequirements}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="" style={{ background: '#111827' }}>No special requirements</option>
            <option value="vegetarian" style={{ background: '#111827' }}>Vegetarian</option>
            <option value="vegan" style={{ background: '#111827' }}>Vegan</option>
            <option value="halal" style={{ background: '#111827' }}>Halal</option>
            <option value="kosher" style={{ background: '#111827' }}>Kosher</option>
            <option value="gluten-free" style={{ background: '#111827' }}>Gluten Free</option>
          </select>
        </div>

        {/* Emergency Contact */}
        <div>
          <label style={labelStyle}>EMERGENCY CONTACT</label>
          <input
            type="tel"
            name="emergencyContact"
            value={form.emergencyContact}
            onChange={handleChange}
            onFocus={() => setFocusedField('emergencyContact')}
            onBlur={() => setFocusedField('')}
            placeholder="+91 98765 00000"
            style={fieldFocusStyle('emergencyContact')}
          />
          {errors.emergencyContact && <div style={errorStyle}>↳ {errors.emergencyContact}</div>}
        </div>
      </div>

      {/* Terms */}
      <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}>
        <label style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="agreeTerms"
            checked={form.agreeTerms}
            onChange={handleChange}
            style={{
              width: 18, height: 18,
              marginTop: 2,
              accentColor: 'var(--gold)',
              flexShrink: 0,
              cursor: 'pointer'
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate)', letterSpacing: '0.07em', lineHeight: 1.8 }}>
            I CONFIRM THAT THE ABOVE INFORMATION IS ACCURATE AND COMPLETE. I AGREE TO COMPLY WITH ALL SECURITY PROTOCOLS AND UNDERSTAND THAT MY REGISTRATION IS SUBJECT TO VERIFICATION. I CONSENT TO MY DATA BEING PROCESSED FOR EVENT ADMINISTRATION PURPOSES.
          </span>
        </label>
        {errors.agreeTerms && <div style={{ ...errorStyle, marginTop: 10 }}>↳ {errors.agreeTerms}</div>}
      </div>

      {serverError && (
        <div style={{ marginTop: '16px', padding: '14px 16px', background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#E57373', letterSpacing: '0.05em' }}>
          ✗ {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: '32px',
          width: '100%',
          background: loading ? 'rgba(201,168,76,0.5)' : 'var(--gold)',
          color: 'var(--navy)',
          border: 'none',
          padding: '18px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.25em',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {loading ? '◌ PROCESSING REGISTRATION...' : 'SUBMIT REGISTRATION REQUEST →'}
      </button>
    </form>
  )
}
