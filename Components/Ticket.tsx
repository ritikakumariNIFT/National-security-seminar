import { useEffect, useRef } from 'react'

interface TicketData {
  ticketId: string
  fullName: string
  organization: string
  designation: string
  category: string
  email: string
  qrDataUrl: string
  registeredAt: string
}

const categoryLabels: Record<string, string> = {
  military: 'ARMED FORCES',
  civil: 'CIVIL SERVICES',
  intelligence: 'INTELLIGENCE',
  academic: 'ACADEMIC',
  media: 'MEDIA',
  international: 'INTERNATIONAL',
  industry: 'DEFENCE INDUSTRY',
}

export default function Ticket({ ticket, onReset }: { ticket: TicketData; onReset: () => void }) {
  const ticketRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => window.print()

  return (
    <div>
      {/* Success message */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(76,175,122,0.1)',
          border: '2px solid #4CAF7A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '28px'
        }}>
          ✓
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4CAF7A', letterSpacing: '0.3em', marginBottom: '12px' }}>
          REGISTRATION CONFIRMED
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          Welcome, {ticket.fullName.split(' ')[0]}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--slate)', fontSize: '14px' }}>
          A confirmation email has been dispatched to <strong style={{ color: 'var(--gold)' }}>{ticket.email}</strong>
        </p>
      </div>

      {/* The Ticket */}
      <div ref={ticketRef} className="ticket-bg" style={{
        border: '1px solid rgba(201,168,76,0.35)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '32px'
      }}>
        {/* Perforated line */}
        <div style={{
          position: 'absolute', right: '200px', top: 0, bottom: 0, width: '1px',
          borderRight: '2px dashed rgba(201,168,76,0.2)',
          zIndex: 2
        }} />

        {/* Corner decorations */}
        {[['0,0','rotate(0)'],['0,auto','rotate(270deg)'],['auto,0','rotate(90deg)'],['auto,auto','rotate(180deg)']].map(([pos, rot], i) => (
          <div key={i} style={{
            position: 'absolute',
            top: pos.split(',')[0] === '0' ? 12 : 'auto',
            bottom: pos.split(',')[1] === 'auto' ? 12 : 'auto',
            left: pos.split(',')[0] === '0' && pos.split(',')[1] !== 'auto' ? 12 : pos.split(',')[0] === '0' ? 12 : 'auto',
            right: pos.split(',')[0] === 'auto' ? 12 : 'auto',
            width: 20, height: 20,
            borderTop: '2px solid var(--gold)',
            borderLeft: '2px solid var(--gold)',
            transform: rot,
            opacity: 0.5
          }} />
        ))}

        <div style={{ display: 'flex' }}>
          {/* Main ticket body */}
          <div style={{ flex: 1, padding: '40px 40px 40px 40px' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--slate)', letterSpacing: '0.3em', marginBottom: '8px' }}>
                UNITED SERVICES INSTITUTION OF INDIA
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color: 'var(--white)', lineHeight: 1.1 }}>
                National Security<br />
                <span style={{ color: 'var(--gold)' }}>Seminar 2025</span>
              </div>
            </div>

            {/* Delegate info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              {[
                { label: 'DELEGATE', value: ticket.fullName },
                { label: 'ORGANIZATION', value: ticket.organization },
                { label: 'DESIGNATION', value: ticket.designation },
                { label: 'CATEGORY', value: categoryLabels[ticket.category] || ticket.category },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--slate)', letterSpacing: '0.25em', marginBottom: '4px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--white)' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Event details bar */}
            <div style={{
              display: 'flex', gap: '24px', flexWrap: 'wrap',
              paddingTop: '20px',
              borderTop: '1px solid rgba(201,168,76,0.2)'
            }}>
              {[
                { icon: '📅', label: '15–16 NOV 2025' },
                { icon: '📍', label: 'USI, NEW DELHI' },
                { icon: '⏰', label: '0900 HOURS' },
              ].map(item => (
                <div key={item.label} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate)', letterSpacing: '0.1em' }}>
                  {item.icon} {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* QR stub */}
          <div style={{
            width: 200,
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(201,168,76,0.04)',
            gap: '16px'
          }}>
            {ticket.qrDataUrl ? (
              <img src={ticket.qrDataUrl} alt="QR Code" style={{ width: 120, height: 120, imageRendering: 'pixelated' }} />
            ) : (
              <div style={{ width: 120, height: 120, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate)', fontSize: '12px' }}>QR CODE</div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--slate)', letterSpacing: '0.15em', marginBottom: '4px' }}>
                TICKET ID
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.1em' }}>
                {ticket.ticketId}
              </div>
            </div>
            <div style={{
              width: '100%',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'rgba(138,155,181,0.6)',
              letterSpacing: '0.1em',
              borderTop: '1px solid rgba(201,168,76,0.15)',
              paddingTop: '12px'
            }}>
              SCAN AT ENTRY<br />FOR VERIFICATION
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '30%',
          transform: 'translate(-50%, -50%) rotate(-25deg)',
          fontFamily: 'var(--font-display)',
          fontSize: '80px',
          fontWeight: 900,
          color: 'rgba(201,168,76,0.04)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '0.2em',
          zIndex: 0
        }}>
          VERIFIED
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={handlePrint}
          style={{
            flex: 1,
            background: 'transparent',
            border: '1px solid var(--gold)',
            color: 'var(--gold)',
            padding: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.2em',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          ⎙ PRINT / SAVE TICKET
        </button>
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '1px solid rgba(138,155,181,0.3)',
            color: 'var(--slate)',
            padding: '14px 24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.15em',
            cursor: 'pointer',
          }}
        >
          ← REGISTER ANOTHER
        </button>
      </div>
    </div>
  )
}
