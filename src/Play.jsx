import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

    const pickQuestion = (list = {}) => {
        const { questions= [] } = list
        const len = questions.length
        if (!len) return ''
        const rnd = Math.floor(Math.random() * len)
        return questions[rnd]
    }

    const Show = ({step, question}) => {
        if (step === 0) return 'Tap to play'
        if (step % 2 === 0) return <>Q: {question.a}</>
        return <>A: {question.q}</>

    }
export default function Play({ list }) {
    const [step, setStep] = useState(0)
    const [question, setQuestion] = useState()

    const onClick = useCallback(() => {
        console.log(step)
        setStep(nb => nb+1)
        if (step % 2 === 0)  {
            setQuestion(pickQuestion(list))
        }

    }, [step])
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
                    <Show step={step} question={question}/>
                </p>
            </div>
            <footer>
                <Link to={`/`}>back</Link>
            </footer>
        </>
    )
}
