import { useContext } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'
import { computeRatio, sortQuestionsByScore } from './utils'

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
                        <span
                            onClick={onQuestionDelete(list, question)}
                            style={{ cursor: 'pointer' }}
                        >
                            🗑️
                        </span>
                        {question.q} → {question.a}{' '}
                        <small>{computeRatio(question)}</small>
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
