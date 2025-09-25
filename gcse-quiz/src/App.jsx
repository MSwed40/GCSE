import React, { useEffect, useState } from 'react'

export default function App() {
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    fetch('/gcse_questions_1000.json')
      .then(r => r.json())
      .then(data => setQuestions(data))
      .catch(err => console.error('Error loading questions:', err))
  }, [])

  if (!questions.length) return <p>Loading questions...</p>

  const q = questions[current]

  const handleAnswer = (idx) => {
    setSelected(idx)
    if (idx === q.answer) setScore(score + 1)
    setTimeout(() => {
      setSelected(null)
      setCurrent((prev) => (prev + 1) % questions.length)
    }, 800)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '2rem auto' }}>
      <h1>GCSE Maths Quiz</h1>
      <p><b>Topic:</b> {q.topic} — <i>{q.subtopic}</i></p>
      <p>{q.question}</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {q.choices.map((c, idx) => (
          <li key={idx}>
            <button
              onClick={() => handleAnswer(idx)}
              style={{
                display: 'block',
                margin: '0.5rem 0',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                background:
                  selected === null
                    ? '#eee'
                    : idx === q.answer
                    ? 'lightgreen'
                    : selected === idx
                    ? 'salmon'
                    : '#eee'
              }}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
      <p>Score: {score}</p>
    </div>
  )
}
