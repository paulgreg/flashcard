import React, {
    useRef,
    useCallback,
    useEffect,
    FormEvent,
    KeyboardEvent,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDataContext } from './DataContext'
import { FlashcardComponent } from './Types'

const AddOrEditQuestion: React.FC<FlashcardComponent> = ({
    list,
    question,
}) => {
    const { addQuestion, editQuestion } = useDataContext()
    const inputQuestionRef = useRef<HTMLInputElement>(null)
    const inputAnswerRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const onSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (!list || !inputQuestionRef.current || !inputAnswerRef.current)
                return
            const questionValue = inputQuestionRef.current.value.trim()
            const answerValue = inputAnswerRef.current.value.trim()
            if (questionValue.length > 0 && answerValue.length > 0) {
                if (question?.id) {
                    editQuestion(list.id)({
                        ...question,
                        q: questionValue,
                        a: answerValue,
                    })
                    navigate(`/list/${list.id}`)
                } else {
                    addQuestion(list.id)({
                        q: questionValue,
                        a: answerValue,
                        v: true,
                    })
                    inputQuestionRef.current.value = ''
                    inputAnswerRef.current.value = ''
                    inputQuestionRef.current.focus()
                }
            }
        },
        [list]
    )

    useEffect(() => {
        if (inputQuestionRef.current && inputAnswerRef.current && question) {
            inputQuestionRef.current.value = question.q
            inputAnswerRef.current.value = question.a
        }
    }, [question])

    const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (inputAnswerRef.current && e.key === 'Enter') {
            inputAnswerRef.current.focus()
        }
    }, [])

    if (!list) return <></>

    return (
        <>
            <div className="content">
                <form onSubmit={onSubmit}>
                    <input
                        ref={inputQuestionRef}
                        type="text"
                        name="question"
                        placeholder="a question"
                        minLength={1}
                        autoFocus
                        style={{ width: '90%' }}
                        onKeyDown={onKeyDown}
                    />
                    <input
                        ref={inputAnswerRef}
                        type="text"
                        name="answer"
                        placeholder="the answer"
                        minLength={1}
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
export default AddOrEditQuestion
