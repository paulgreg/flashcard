import { useContext, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { filterNonVisible, sortQuestionsByScore } from './utils'
import DataContext from './DataContext'

const styleScore = {
    cursor: 'pointer',
    padding: '1em',
}

const usePickQuestion = (list) => {
    const [idx, setIdx] = useState(0)
    const [questions, setQuestions] = useState(
        filterNonVisible(list.questions).sort(sortQuestionsByScore)
    )

    const next = useCallback(() => {
        const nextIdx = idx + 1
        if (nextIdx === questions.length) {
            setIdx(0)
            const questionsResorted = filterNonVisible(list.questions).sort(
                sortQuestionsByScore
            )
            setQuestions(questionsResorted)
            return questionsResorted[0]
        } else {
            setIdx(nextIdx)
            return questions[nextIdx]
        }
    }, [idx, questions])

    return { first: questions[0], next }
}

export default function Play({ list }) {
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
                    const nextQuestion = next()
                    setQuestion(nextQuestion)
                } else {
                    return
                }
            }
            setStep((nb) => nb + 1)
        },
        [step, question, next]
    )

    const even = step % 2 === 0
    const odd = !even

    return (
        <>
            <div className="content" onClick={onClick}>
                <div
                    style={{
                        height: '100%',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '30px',
                    }}
                >
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
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            height: '100px',
                            width: '100%',
                        }}
                    >
                        {odd && (
                            <>
                                <span style={styleScore} data-score="1">
                                    👍
                                </span>
                                <span style={styleScore} data-score="0">
                                    👎
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <footer>
                <Link to={`/list/${list.id}`}>back</Link>
            </footer>
        </>
    )
}
