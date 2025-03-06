import React, { useEffect, useState, useCallback, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { filterNonVisible, sortQuestionsByScore } from './utils'
import { useDataContext } from './DataContext'
import { FlashcardComponent, FlashcardList } from './Types'

const styleScore = {
    cursor: 'pointer',
    padding: '1em',
}

const usePickQuestion = (list: FlashcardList) => {
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

const OK = 1
const KO = 0

const Play: React.FC<FlashcardComponent> = ({ list }) => {
    const [step, setStep] = useState(0)
    const { first, next } = usePickQuestion(list)
    const [question, setQuestion] = useState(first)
    const { setScore } = useDataContext()

    const even = step % 2 === 0
    const odd = !even

    const updateScoreAndGoToNextQuestion = useCallback(
        (score: number) => {
            setScore(list.id, question.id, score)
            setQuestion(next())
            setStep((nb) => nb + 1)
        },
        [list, question, setScore, setQuestion, next, setStep]
    )

    const onClick = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLDivElement
            if (even) {
                setStep((nb) => nb + 1)
            } else if (target.tagName === 'SPAN') {
                const score = target.dataset.score ?? '0'
                updateScoreAndGoToNextQuestion(parseInt(score, 10))
            }
        },
        [even, setStep, updateScoreAndGoToNextQuestion]
    )

    const handleKeyDownEvent = useCallback(
        (e: KeyboardEvent) => {
            if (even && e.key === 'ArrowDown') {
                setStep((nb) => nb + 1)
            } else if (odd) {
                if (e.key === 'ArrowLeft') {
                    updateScoreAndGoToNextQuestion(KO)
                } else if (e.key === 'ArrowRight') {
                    updateScoreAndGoToNextQuestion(OK)
                }
            }
        },
        [even, odd, setStep, updateScoreAndGoToNextQuestion]
    )

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDownEvent, true)
        return () =>
            document.removeEventListener('keydown', handleKeyDownEvent, true)
    }, [handleKeyDownEvent])

    if (!question)
        return (
            <>
                <div className="content">
                    <p>no question</p>
                </div>
                <footer>
                    <Link to={`/list/${list.id}`}>back</Link>
                </footer>
            </>
        )

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
                                <span style={styleScore} data-score={KO}>
                                    👎
                                </span>
                                <span style={styleScore} data-score={OK}>
                                    👍
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

export default Play
