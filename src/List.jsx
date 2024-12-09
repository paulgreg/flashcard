import { useContext, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'
import { sortQuestionsByScore, limitNumber } from './utils'

const QuestionScore = ({ question }) => {
    if (!question.count) return null

    const styleNb = {
        fontSize: '.75em',
    }
    return (
        <div
            style={{ display: 'flex', justifyContent: 'end', fontSize: '.8em' }}
        >
            <span>
                👍
                <span style={styleNb}>{limitNumber(question.score)}</span>
            </span>
            <span style={{ paddingLeft: '.2em' }}>
                👎
                <span style={styleNb}>
                    {limitNumber(question.count - question.score)}
                </span>
            </span>
        </div>
    )
}

export default function List({ list }) {
    const { editQuestion, delQuestion } = useContext(DataContext)

    const onQuestionDelete = (list, question) => () => {
        if (window.confirm(`Delete question ${question.q} ?`))
            delQuestion(list.id, question.id)
    }

    const onVisibleChange = useCallback(
        (list, question) => (e) => {
            e.stopPropagation()
            editQuestion(list.id)(
                question.id,
                question.q,
                question.a,
                e.target.checked
            )
        },
        [editQuestion]
    )

    return (
        <>
            <div className="content">
                <h2>{list.name}</h2>
                {list.questions.length === 0 && <p>No question</p>}
                {list.questions.sort(sortQuestionsByScore).map((question) => (
                    <div
                        key={question.id}
                        className="row"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 10fr 1fr',
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                            }}
                        >
                            <span
                                onClick={onQuestionDelete(list, question)}
                                style={{ cursor: 'pointer' }}
                            >
                                🗑️
                            </span>
                            <Link
                                to={`/list/${list.id}/edit/${question.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                ✏️
                            </Link>
                        </div>
                        {question.q} → {question.a}{' '}
                        <div>
                            <label style={{ fontSize: '16px' }}>
                                <span>visible</span>
                                <input
                                    type="checkbox"
                                    checked={question.v}
                                    onChange={onVisibleChange(list, question)}
                                />
                            </label>
                            <QuestionScore question={question} />
                        </div>
                    </div>
                ))}
            </div>
            <footer>
                <Link to={`/list/${list.id}/add`}>add question</Link>
                {list.questions.length > 0 && (
                    <>
                        {' | '}
                        <Link
                            to={`/list/${list.id}/play`}
                            style={{
                                textDecoration: 'none',
                            }}
                        >
                            ▶
                        </Link>
                    </>
                )}
            </footer>
        </>
    )
}
