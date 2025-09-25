import React, { useState } from 'react'
import Quiz from './Quiz'

const subjectThemes = {
  Maths: '#dbeafe',      // pastel blue
  Physics: '#ede9fe',    // pastel purple
  Chemistry: '#fee2e2',  // pastel red
  Biology: '#dcfce7',    // pastel green
}

export default function App() {
  const [subject, setSubject] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const handleDonate = () => {
    window.open('https://paypal.me/moet86', '_blank')
    showToast('✅ Thank you! PayPal opened in a new tab.')
  }

  const handleFeedback = () => {
    window.location.href = 'mailto:iworks2025@outlook.com?subject=GCSE Quiz Feedback'
    showToast('✉️ Your email app should now be open.')
  }

  if (!subject) {
    return (
      <div style={{fontFamily:'sans-serif', textAlign:'center', minHeight:'100vh', background:'#f3f4f6', paddingTop:'5rem', position:'relative'}}>
        <h1 style={{ marginBottom:'1.5rem' }}>GCSE Quiz Hub</h1>
        <p style={{ marginBottom:'2rem' }}>Select a subject to begin:</p>
        <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
          {Object.keys(subjectThemes).map(subj => (
            <button key={subj} onClick={() => setSubject(subj)}
              style={{ padding:'1.5rem 2.5rem', borderRadius:'12px', border:'none', fontSize:'1.2rem', cursor:'pointer',
                       background:subjectThemes[subj], minWidth:'160px', boxShadow:'0 2px 6px rgba(0,0,0,0.1)', transition:'transform 0.2s' }}
              onMouseOver={(e)=>e.currentTarget.style.transform='scale(1.05)'}
              onMouseOut={(e)=>e.currentTarget.style.transform='scale(1)'}
            >{subj}</button>
          ))}
        </div>
        <div style={{ marginTop:'4rem' }}>
          <button onClick={handleDonate} style={{ padding:'0.75rem 1.6rem', margin:'0.5rem', borderRadius:'8px', border:'none', background:'#ffd700',
                                                  cursor:'pointer', fontSize:'1rem', boxShadow:'0 2px 6px rgba(0,0,0,0.1)' }}>☕ Donate</button>
          <button onClick={handleFeedback} style={{ padding:'0.75rem 1.6rem', margin:'0.5rem', borderRadius:'8px', border:'none', background:'#93c5fd',
                                                    cursor:'pointer', fontSize:'1rem', boxShadow:'0 2px 6px rgba(0,0,0,0.1)' }}>✉️ Leave Feedback</button>
        </div>
        {toast && (
          <div style={{ position:'fixed', bottom:'20px', right:'20px', background:'#fff', color:'#374151', padding:'1rem 1.5rem',
                        borderRadius:'12px', boxShadow:'0 4px 12px rgba(0,0,0,0.12)', fontSize:'1rem', animation:'fadeInUp 0.25s ease' }}>
            {toast}
          </div>
        )}
      </div>
    )
  }

  return <Quiz subject={subject} theme={subjectThemes[subject]} onBack={() => setSubject(null)} />
}