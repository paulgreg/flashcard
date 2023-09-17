import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

const pickQuestion = (list = {}) => {
    const { questions = [] } = list
    const len = questions.length
    if (!len) return ''
    const rnd = Math.floor(Math.random() * len)
    return questions[rnd]
}

export default function Play({ list }) {
    const [step, setStep] = useState(0)
    const [question, setQuestion] = useState(pickQuestion(list))

    const onClick = useCallback(() => {
        if (step % 2 !== 0) {
            setQuestion(pickQuestion(list))
        }
        setStep((nb) => nb + 1)
    }, [step])

    const odd = step % 2 === 0

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
                    {odd ? (
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
                </p>
            </div>
            <footer>
                <Link to={`/`}>back</Link>
            </footer>
        </>
    )
}
