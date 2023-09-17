import { useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'

export default function AddQuestion({ list }) {
    const { addQuestion } = useContext(DataContext)
    const inputQuestionRef = useRef()
    const inputAnswerRef = useRef()

    const onSubmit = (e) => {
        e.preventDefault()
        const questionValue = inputQuestionRef.current.value.trim()
        const answerValue = inputAnswerRef.current.value.trim()
        if (questionValue.length > 0 && answerValue.length > 0) {
            addQuestion(list.id)(questionValue, answerValue)
            inputQuestionRef.current.value = ''
            inputAnswerRef.current.value = ''
            inputQuestionRef.current.focus()
        }
    }

    return (
        <>
            <div className="content">
                <form onSubmit={onSubmit}>
                    <input
                        ref={inputQuestionRef}
                        type="text"
                        name="question"
                        placeholder="a question"
                        minLength="1"
                        autoFocus
                        style={{ width: '90%' }}
                    />
                    <input
                        ref={inputAnswerRef}
                        type="text"
                        name="answer"
                        placeholder="the answer"
                        minLength="1"
                        style={{ width: '90%' }}
                    />
                    <input type="submit" value="ok" style={{ width: '80%' }} />
                </form>

                {list.questions.length === 0 && <p>No question</p>}
                {list.questions.map((question) => (
                    <p key={question.id}>
                        <strong>{question.q}</strong> → {question.a}
                    </p>
                ))}
            </div>
            <footer>
                <Link to={`/list/${list.id}`}>back</Link>
            </footer>
        </>
    )
}
