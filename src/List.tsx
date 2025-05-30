import React from 'react'
import { Link } from 'react-router-dom'
import { useDataContext } from './DataContext'
import { sortQuestionsByScore, limitNumber } from './utils'
import { FlashcardComponent, FlashcardList, FlashcardQuestion } from './Types'

const QuestionScore: React.FC<{ question: FlashcardQuestion }> = ({
    question,
}) => {
    if (!question.count || !question.score) return null

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

const List: React.FC<FlashcardComponent> = ({ list }) => {
    const { delQuestion } = useDataContext()

    const onQuestionDelete =
        (list: FlashcardList, question: FlashcardQuestion) => () => {
            if (window.confirm(`Delete question ${question.q} ?`))
                delQuestion(list.id, question.id)
        }

    if (!list) return <></>

    return (
        <>
            <div className="content">
                <h2>{list.name}</h2>
                {list.questions.length === 0 && <p>No question</p>}
                {list.questions
                    .toSorted(sortQuestionsByScore)
                    .map((question) => (
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
                                <QuestionScore question={question} />
                            </div>
                        </div>
                    ))}
            </div>
            <footer>
                <Link to={`/list/${list.id}/add`}>add question</Link>
                {' | '}
                <Link to="/search">search</Link>
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
export default List
