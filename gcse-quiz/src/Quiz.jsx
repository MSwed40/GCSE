import React, { useEffect, useState } from 'react'

export default function Quiz({ subject, theme, onBack }) {
  const [allQuestions, setAllQuestions] = useState([])
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [difficulty, setDifficulty] = useState('All')
  const [numQuestions, setNumQuestions] = useState(10)

  useEffect(() => {
    fetch(`/${subject.toLowerCase()}.json`)
      .then(r => r.json())
      .then(data => setAllQuestions(data))
      .catch(err => console.error('Error loading questions:', err))
  }, [subject])

  const shuffle = (array) => {
    let arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const startQuiz = () => {
    let filtered = allQuestions
    if (difficulty !== 'All') filtered = allQuestions.filter(q => q.difficulty === difficulty)
    const shuffled = shuffle(filtered).slice(0, numQuestions)
    setQuestions(shuffled)
    setCurrent(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
  }

  if (!allQuestions.length) {
    return (
      <div style={{ background: theme, minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
        <button onClick={onBack} style={{ marginBottom: '1rem' }}>⬅ Back</button>
        <p>Loading {subject} questions...</p>
      </div>
    )
  }

  if (!questions.length && !finished) {
    return (
      <div style={{ background: theme, minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
        <button onClick={onBack} style={{ marginBottom: '1rem' }}>⬅ Back</button>
        <h2 style={{ marginTop: 0 }}>{subject} Quiz</h2>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <label>Difficulty:&nbsp;
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value='All'>All</option>
              <option value='Easy'>Easy</option>
              <option value='Medium'>Medium</option>
              <option value='Hard'>Hard</option>
            </select>
          </label>
          <br /><br />
          <label>Number of questions:&nbsp;
            <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </label>
          <br /><br />
          <button onClick={startQuiz} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ccc' }}>Start</button>
        </div>
      </div>
    )
  }

  if (finished) {
    const total = questions.length
    const percent = ((score / total) * 100).toFixed(1)
    return (
      <div style={{ background: theme, minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
        <button onClick={onBack} style={{ marginBottom: '1rem' }}>⬅ Back</button>
        <h2>Quiz Finished!</h2>
        <p>You scored {score}/{total} ({percent}%)</p>
        <button onClick={startQuiz} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ccc' }}>Restart</button>
      </div>
    )
  }

  const q = questions[current]

  const handleAnswer = (idx) => {
    setSelected(idx)
    if (idx === q.answer) setScore(s => s + 1)
    setTimeout(() => {
      setSelected(null)
      if (current + 1 < questions.length) setCurrent(current + 1)
      else setFinished(true)
    }, 700)
  }

  return (
    <div style={{ background: theme, minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <button onClick={onBack} style={{ marginBottom: '1rem' }}>⬅ Back</button>
      <h2 style={{ marginTop: 0 }}>{subject} Quiz</h2>

      {/* ✅ Horizontally centered container */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: '1.25rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: 720,
          width: '100%'
        }}>
          <div style={{ marginBottom: '0.5rem', color: '#6b7280' }}>
            <small>Topic: {q.topic} • {q.subtopic} • Difficulty: {q.difficulty}</small>
          </div>
          <h3 style={{ marginTop: 0 }}>{q.question}</h3>
          <div style={{ marginTop: '1rem' }}>
            {q.choices.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  margin: '0.5rem 0',
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  background: selected === null
                    ? '#f9fafb'
                    : (idx === q.answer
                      ? '#dcfce7'
                      : (selected === idx ? '#fee2e2' : '#f9fafb'))
                }}
              >
                <b>{String.fromCharCode(65 + idx)}.</b> {c}
              </button>
            ))}
          </div>
          <p style={{ marginTop: '0.75rem', fontWeight: 'bold' }}>
            Score: {score}/{current + 1} ({((score / (current + 1)) * 100).toFixed(1)}%)
          </p>
        </div>
      </div>
    </div>
  )
}
