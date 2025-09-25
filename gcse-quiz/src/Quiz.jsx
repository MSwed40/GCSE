import React, { useEffect, useState } from 'react'

export default function Quiz({ subject, theme, onBack }) {
  const [allQuestions, setAllQuestions] = useState([])
  const [topics, setTopics] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([]) // multi-select
  const [difficulty, setDifficulty] = useState('All')
  const [numQuestions, setNumQuestions] = useState(10)

  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    fetch(`/${subject.toLowerCase()}.json`)
      .then(r => r.json())
      .then(data => {
        setAllQuestions(data)
        const uniqueTopics = Array.from(new Set(data.map(q => q.topic))).sort()
        setTopics(uniqueTopics)
        setSelectedTopics([]) // none selected => all topics
      })
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
    if (selectedTopics.length > 0) filtered = filtered.filter(q => selectedTopics.includes(q.topic))
    if (difficulty !== 'All') filtered = filtered.filter(q => q.difficulty === difficulty)
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

        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Topics (choose multiple; leave empty for all):</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {topics.map(t => {
                const active = selectedTopics.includes(t)
                return (
                  <button key={t}
                          onClick={() => active
                            ? setSelectedTopics(selectedTopics.filter(x => x !== t))
                            : setSelectedTopics([...selectedTopics, t])}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: 8,
                            border: active ? '2px solid #2563eb' : '1px solid #ccc',
                            background: active ? '#dbeafe' : '#f9fafb',
                            cursor: 'pointer'
                          }}>
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Difficulty:&nbsp;
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value='All'>All</option>
                <option value='Easy'>Easy</option>
                <option value='Medium'>Medium</option>
                <option value='Hard'>Hard</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Number of questions:&nbsp;
              <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>

          <button onClick={startQuiz} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ccc' }}>Start</button>
        </div>
      </div>
    )
  }

  if (finished) {
    const answered = questions.length
    const percent = answered ? ((score / answered) * 100).toFixed(1) : '0.0'
    return (
      <div style={{ background: theme, minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
        <button onClick={onBack} style={{ marginBottom: '1rem' }}>⬅ Back</button>
        <h2>Quiz Finished!</h2>
        <p>You scored {score}/{answered} ({percent}%)</p>
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

  const answeredSoFar = current // do not count current question until answered
  const livePercent = answeredSoFar === 0 ? 0 : (score / answeredSoFar * 100)

  return (
    <div style={{ background: theme, minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <button onClick={onBack} style={{ marginBottom: '1rem' }}>⬅ Back</button>
      <h2 style={{ marginTop: 0 }}>{subject} Quiz</h2>

      {/* Centered horizontally */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: 720, width: '100%' }}>
          <div style={{ marginBottom: '0.5rem', color: '#6b7280' }}>
            <small>Topic: {q.topic} • {q.subtopic} • Difficulty: {q.difficulty}</small>
          </div>
          <h3 style={{ marginTop: 0 }}>{q.question}</h3>
          <div style={{ marginTop: '1rem' }}>
            {q.choices.map((c, idx) => (
              <button key={idx} onClick={() => handleAnswer(idx)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  margin: '0.5rem 0', padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid #e5e7eb',
                  background: selected === null ? '#f9fafb' : (idx === q.answer ? '#dcfce7' : (selected === idx ? '#fee2e2' : '#f9fafb'))
                }}>
                <b>{String.fromCharCode(65 + idx)}.</b> {c}
              </button>
            ))}
          </div>
          <p style={{ marginTop: '0.75rem', fontWeight: 'bold' }}>
            Score: {score}/{answeredSoFar} ({livePercent.toFixed(1)}%)
          </p>
        </div>
      </div>
    </div>
  )
}
