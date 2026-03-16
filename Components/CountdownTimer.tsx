import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calculate()
    const id = setInterval(calculate, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINS', value: timeLeft.minutes },
    { label: 'SECS', value: timeLeft.seconds },
  ]

  return (
    <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {units.map(u => (
        <div key={u.label} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 500,
            color: 'var(--gold)',
            lineHeight: 1,
            minWidth: '80px',
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.2)',
            padding: '16px 20px',
            letterSpacing: '0.05em'
          }}>
            {String(u.value).padStart(2, '0')}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--slate)', letterSpacing: '0.3em', marginTop: 8 }}>
            {u.label}
          </div>
        </div>
      ))}
    </div>
  )
}
