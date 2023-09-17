import { useContext, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { sortQuestionsByScore } from './utils'
import DataContext from './DataContext'

const styleScore = {
    cursor: 'pointer',
    padding: '1em',
    width: '90%',
}

const usePickQuestion = (list) => {
    const [idx, setIdx] = useState(0)
    const [questions, setQuestions] = useState(
        list.questions.sort(sortQuestionsByScore)
    )

    const next = useCallback(() => {
        if (idx === questions.length) {
            setIdx(0)
            const questionsResorted = questions.sort(sortQuestionsByScore)
            setQuestions(questionsResorted)
            return questionsResorted[0]
        } else {
            setIdx(idx + 1)
            return questions[idx]
        }
    }, [idx, questions])

    return { first: questions[0], next }
}

export default function Play({ list, index }) {
    const [step, setStep] = useState(0)
    const { first, next } = usePickQuestion(list)
    const [question, setQuestion] = useState(first)
    const { setScore } = useContext(DataContext)

    const onClick = useCallback(
        (e) => {
            const odd = step % 2 !== 0
            if (odd) {
                if (e.target.tagName === 'SPAN') {
                    const score = parseInt(e.target.dataset.score, 10)
                    setScore(list.id, question.id, score)
                    setQuestion(next())
                } else {
                    return
                }
            }
            setStep((nb) => nb + 1)
        },
        [step, next]
    )

    const even = step % 2 === 0
    const odd = !even

    return (
        <>
            <div className="content" onClick={onClick}>
                <p
                    style={{
                        height: 'calc(100% - 120px)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '50px',
                        textTransform: 'uppercase',
                    }}
                >
                    {odd && (
                        <span style={styleScore} data-score="1">
                            👍
                        </span>
                    )}

                    {even ? (
                        question.q
                    ) : (
                        <strong
                            style={{
                                color: '#fc997c',
                            }}
                        >
                            {question.a}
                        </strong>
                    )}
                    {odd && (
                        <span style={styleScore} data-score="0">
                            👎
                        </span>
                    )}
                </p>
            </div>
            <footer>
                <Link to={`/`}>back</Link>
            </footer>
        </>
    )
}
