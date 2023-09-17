import { useContext } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'

export default function List({ list, listIdx }) {
    const { delQuestion } = useContext(DataContext)

    const onQuestionDelete = (listIdx, question, qIdx) => (e) => {
        if (window.confirm(`Delete question ${question.a} ?`))
            delQuestion(listIdx, qIdx)
    }

    return (
        <>
            <div className="content">
                {list.questions.length === 0 && <p>No question</p>}
                {list.questions.sort().map((question, qIdx) => (
                    <p
                        key={qIdx}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 10fr 1fr',
                            gap: 10,
                        }}
                    >
                        <span
                            onClick={onQuestionDelete(listIdx, question, qIdx)}
                            style={{ cursor: 'pointer' }}
                        >
                            🗑️
                        </span>
                        {question.q} → {question.a}
                        <span></span>
                    </p>
                ))}
            </div>
            <footer>
                <Link to={`/list/${listIdx}/add`}>add question</Link>
                {' | '}
                <Link
                    to={`/list/${listIdx}/play`}
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
