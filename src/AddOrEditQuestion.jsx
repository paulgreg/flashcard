import { useContext, useRef, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataContext from './DataContext'

export default function AddOrEditQuestion({ list, question }) {
    const { addQuestion, editQuestion } = useContext(DataContext)
    const inputQuestionRef = useRef()
    const inputAnswerRef = useRef()
    const navigate = useNavigate()

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault()
            const questionValue = inputQuestionRef.current.value.trim()
            const answerValue = inputAnswerRef.current.value.trim()
            if (questionValue.length > 0 && answerValue.length > 0) {
                if (question?.id) {
                    editQuestion(list.id)(
                        question.id,
                        questionValue,
                        answerValue
                    )
                    navigate(`/list/${list.id}`)
                } else {
                    addQuestion(list.id)(questionValue, answerValue)
                    inputQuestionRef.current.value = ''
                    inputAnswerRef.current.value = ''
                    inputQuestionRef.current.focus()
                }
            }
        },
        [list]
    )

    useEffect(() => {
        if (question) {
            inputQuestionRef.current.value = question.q
            inputAnswerRef.current.value = question.a
        }
    }, [question])

    const onKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            inputAnswerRef.current.focus()
        }
        return e
    }, [])

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
                        onKeyDown={onKeyDown}
                    />
                    <input
                        ref={inputAnswerRef}
                        type="text"
                        name="answer"
                        placeholder="the answer"
                        minLength="1"
                        style={{ width: '90%' }}
                    />
                    <input type="submit" value="ok" style={{ width: '60px' }} />
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
