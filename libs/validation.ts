// Server-side validation utilities

export interface RegistrationInput {
  fullName: string
  email: string
  phone: string
  organization: string
  designation: string
  category: string
  dietaryRequirements?: string
  emergencyContact?: string
  agreeTerms: boolean
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

const VALID_CATEGORIES = ['military', 'civil', 'intelligence', 'academic', 'media', 'international', 'industry']
const VALID_DIETARY = ['', 'vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free']

// Sanitize: strip HTML/SQL injection patterns
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/[<>'"]/g, '') // Remove HTML chars
    .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi, '') // Remove SQL keywords
    .trim()
    .slice(0, 500) // Limit length
}

export function validateRegistration(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  // Type checks
  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: { general: 'Invalid request body' } }
  }

  // Full name
  const fullName = sanitizeString(String(data.fullName || ''))
  if (!fullName) errors.fullName = 'Full name is required'
  else if (fullName.length < 3) errors.fullName = 'Name too short'
  else if (!/^[a-zA-Z\s.\-']+$/.test(fullName)) errors.fullName = 'Name contains invalid characters'
  else if (fullName.length > 100) errors.fullName = 'Name too long'

  // Email
  const email = sanitizeString(String(data.email || '')).toLowerCase()
  if (!email) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Invalid email format'
  else if (email.length > 255) errors.email = 'Email too long'

  // Phone
  const phone = sanitizeString(String(data.phone || ''))
  if (!phone) errors.phone = 'Phone is required'
  else if (!/^[+\d\s\-()]{8,20}$/.test(phone)) errors.phone = 'Invalid phone format'

  // Organization
  const organization = sanitizeString(String(data.organization || ''))
  if (!organization) errors.organization = 'Organization is required'
  else if (organization.length < 2) errors.organization = 'Organization name too short'
  else if (organization.length > 200) errors.organization = 'Organization name too long'

  // Designation
  const designation = sanitizeString(String(data.designation || ''))
  if (!designation) errors.designation = 'Designation is required'
  else if (designation.length > 100) errors.designation = 'Designation too long'

  // Category — strict enum check
  const category = String(data.category || '')
  if (!VALID_CATEGORIES.includes(category)) errors.category = 'Invalid category'

  // Dietary — optional strict enum
  const dietary = String(data.dietaryRequirements || '')
  if (!VALID_DIETARY.includes(dietary)) errors.dietaryRequirements = 'Invalid dietary option'

  // Emergency contact — optional
  const emergency = sanitizeString(String(data.emergencyContact || ''))
  if (emergency && !/^[+\d\s\-()]{8,20}$/.test(emergency)) {
    errors.emergencyContact = 'Invalid emergency contact'
  }

  // Terms
  if (data.agreeTerms !== true) errors.agreeTerms = 'Must agree to terms'

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// Rate limiting store (in-memory; use Redis in production)
const requestLog = new Map<string, number[]>()

export function checkRateLimit(ip: string, maxRequests = 3, windowMs = 3600000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs
  const requests = (requestLog.get(ip) || []).filter((t: number) => t > windowStart)
  if (requests.length >= maxRequests) return false
  requests.push(now)
  requestLog.set(ip, requests)
  return true
}
