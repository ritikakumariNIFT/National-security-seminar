import Head from 'next/head'
import { useState } from 'react'
import RegistrationForm from '../components/RegistrationForm'
import Ticket from '../components/Ticket'
import CountdownTimer from '../components/CountdownTimer'

export default function Home() {
  const [ticket, setTicket] = useState<any>(null)

  const speakers = [
    { name: 'Gen. (Ret.) Marcus Holloway', role: 'Former NSA Director', topic: 'AI & Warfare' },
    { name: 'Dr. Priya Nair', role: 'MIT Lincoln Laboratory', topic: 'Cyber Sovereignty' },
    { name: 'Ambassador Elena Vasquez', role: 'UN Security Council', topic: 'Coalition Diplomacy' },
    { name: 'Col. James Okafor', role: 'Pentagon Strategy Division', topic: 'Hybrid Threats' },
  ]

  const agenda = [
    { time: '08:30', event: 'Registration & Security Clearance Check', type: 'logistics' },
    { time: '09:00', event: 'Opening Address — State of Global Security', type: 'keynote' },
    { time: '10:00', event: 'Panel I: AI, Autonomous Systems & The Future of Conflict', type: 'panel' },
    { time: '11:30', event: 'Panel II: Cybersecurity in Critical Infrastructure', type: 'panel' },
    { time: '13:00', event: 'Classified Briefing Lunch (Cleared Personnel Only)', type: 'special' },
    { time: '14:30', event: 'Workshop: Geopolitical Wargaming Simulation', type: 'workshop' },
    { time: '16:00', event: 'Panel III: Coalition Intelligence & Multilateral Defense', type: 'panel' },
    { time: '17:30', event: 'Closing Remarks & Networking Reception', type: 'logistics' },
  ]

  const typeColors: Record<string, string> = {
    logistics: '#8A9BB5',
    keynote: '#C9A84C',
    panel: '#F0EDE8',
    special: '#C0392B',
    workshop: '#4CAF7A',
  }

  return (
    <>
      <Head>
        <title>National Security Seminar 2025 — USI</title>
        <meta name="description" content="Register for the premier national security event of the year." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Classified banner */}
      <div className="classified-bar py-1.5 text-center">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', letterSpacing: '0.2em', fontWeight: 500 }}>
          ◆ RESTRICTED EVENT — AUTHORIZED PERSONNEL ONLY — REGISTER BELOW TO RECEIVE ACCESS ◆
        </span>
      </div>

      {/* Hero */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #060912 0%, #0A0E1A 100%)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '80px 24px' }}>

        {/* Grid lines background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Eagle/emblem placeholder */}
        <div className="animate-fade-up" style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            border: '2px solid var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            background: 'rgba(201,168,76,0.07)'
          }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 4L24 14H36L26 20L30 32L20 25L10 32L14 20L4 14H16L20 4Z" fill="#C9A84C" opacity="0.9"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate)', letterSpacing: '0.25em' }}>
            UNITED SERVICES INSTITUTION
          </div>
        </div>

        <div className="animate-fade-up-delay-1" style={{ textAlign: 'center', maxWidth: 900 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.3em', marginBottom: '16px' }}>
            15–16 NOVEMBER 2025 · NEW DELHI, INDIA
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 8vw, 96px)',
            lineHeight: 1.0,
            fontWeight: 900,
            color: 'var(--white)',
            marginBottom: '8px'
          }}>
            National<br />
            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Security</span><br />
            Seminar
          </h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--slate)', letterSpacing: '0.2em', marginTop: '16px', marginBottom: '32px' }}>
            ── CLASSIFIED STRATEGIC FORUM ──
          </div>
          <p className="animate-fade-up-delay-2" style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--slate)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
            India's foremost gathering of defense strategists, intelligence officials, and national security scholars. By invitation and verified registration only.
          </p>
        </div>

        <div className="animate-fade-up-delay-3" style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '64px' }}>
          {[
            { label: 'Confirmed Speakers', value: '24+' },
            { label: 'Nations Represented', value: '18' },
            { label: 'Registered Delegates', value: '340' },
            { label: 'Years Running', value: '12' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate)', letterSpacing: '0.15em', marginTop: 8 }}>{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <a href="#register" className="animate-fade-up-delay-4 pulse-gold" style={{
          display: 'inline-block',
          background: 'var(--gold)',
          color: 'var(--navy)',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          padding: '16px 48px',
          textDecoration: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          REQUEST CLEARANCE →
        </a>

        <div className="animate-fade-up-delay-5" style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, transparent, var(--gold))', margin: '0 auto' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--slate)', letterSpacing: '0.2em', marginTop: 8 }}>SCROLL</div>
        </div>
      </section>

      {/* Countdown */}
      <section style={{ background: 'var(--navy-light)', padding: '48px 24px', borderTop: '1px solid rgba(201,168,76,0.2)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate)', letterSpacing: '0.25em', marginBottom: '24px' }}>
            EVENT COMMENCES IN
          </div>
          <CountdownTimer targetDate="2025-11-15T09:00:00+05:30" />
        </div>
      </section>

      {/* Speakers */}
      <section style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: '64px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.3em', marginBottom: '16px' }}>
            CONFIRMED SPEAKERS
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700 }}>
            Distinguished Voices
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px' }}>
          {speakers.map((s, i) => (
            <div key={i} style={{
              background: 'var(--navy-light)',
              padding: '40px 32px',
              borderLeft: '3px solid var(--gold)',
              transition: 'background 0.2s'
            }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--gold)' }}>
                  {s.name.split(' ').filter(w => w.length > 2)[0][0]}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: 6 }}>{s.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate)', letterSpacing: '0.1em', marginBottom: 12 }}>{s.role}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--gold)', borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: 12 }}>
                Topic: {s.topic}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Agenda */}
      <section style={{ padding: '60px 24px 100px', background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-light) 100%)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.3em', marginBottom: '16px' }}>
              PROGRAMME OF EVENTS
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700 }}>
              Day One Agenda
            </h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '76px', top: 0, bottom: 0, width: '1px', background: 'rgba(201,168,76,0.2)' }} />
            {agenda.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '32px', marginBottom: '24px', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--slate)', width: 50, flexShrink: 0, paddingTop: 2 }}>{item.time}</div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: typeColors[item.type], flexShrink: 0, marginTop: 4, position: 'relative', zIndex: 1, boxShadow: `0 0 8px ${typeColors[item.type]}` }} />
                <div style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '15px', color: typeColors[item.type] === '#F0EDE8' ? 'var(--white)' : typeColors[item.type], paddingTop: 0 }}>
                  {item.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" style={{ padding: '100px 24px', background: '#060912', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.3em', marginBottom: '16px' }}>
              SECURE REGISTRATION
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, marginBottom: '16px' }}>
              Request Access
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--slate)', fontSize: '15px', lineHeight: 1.7 }}>
              All registrations are verified. You will receive a digitally signed ticket with a unique QR code upon approval.
            </p>
          </div>

          {ticket ? (
            <Ticket ticket={ticket} onReset={() => setTicket(null)} />
          ) : (
            <RegistrationForm onSuccess={(ticketData) => setTicket(ticketData)} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--navy)', borderTop: '1px solid rgba(201,168,76,0.1)', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate)', letterSpacing: '0.2em', marginBottom: 8 }}>
          UNITED SERVICES INSTITUTION OF INDIA
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(138,155,181,0.5)', letterSpacing: '0.1em' }}>
          Founded 1870 · Rao Tula Ram Marg, Delhi Cantonment · New Delhi 110010
        </div>
        <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(138,155,181,0.3)' }}>
          © 2025 USI NATIONAL SECURITY SEMINAR. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </>
  )
}
