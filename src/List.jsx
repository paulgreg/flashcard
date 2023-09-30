import { useContext } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'
import { sortQuestionsByScore, limitNumber } from './utils'

const QuestionScore = ({ question }) => {
    if (!question.count) return null

    const styleNb = {
        fontSize: '.75em',
    }
    return (
        <div style={{ display: 'flex', fontSize: '.8em' }}>
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
    const { delQuestion } = useContext(DataContext)

    const onQuestionDelete = (list, question) => () => {
        if (window.confirm(`Delete question ${question.q} ?`))
            delQuestion(list.id, question.id)
    }

    return (
        <>
            <div className="content">
                <h2>{list.name}</h2>
                {list.questions.length === 0 && <p>No question</p>}
                {list.questions.sort(sortQuestionsByScore).map((question) => (
                    <p
                        key={question.id}
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
                        <QuestionScore question={question} />
                    </p>
                ))}
            </div>
            <footer>
                <Link to={`/list/${list.id}/add`}>add question</Link>
                {' | '}
                <Link
                    to={`/list/${list.id}/play`}
                    style={{
                        textDecoration: 'none',
                    }}
                >
                    ▶
                </Link>
            </footer>
        </>
    )
}
