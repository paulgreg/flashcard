import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDataContext } from './DataContext'
import { sortQuestionsByScore, limitNumber } from './utils'
import { FlashcardComponent, FlashcardList, FlashcardQuestion } from './Types'
import s from './List.module.css'
import c from './common.module.css'

const QuestionScore: React.FC<{ question: FlashcardQuestion }> = ({
    question,
}) => {
    if (question.count === undefined || question.score === undefined)
        return null

    return (
        <div className={s.scoreBar}>
            <span>
                👍
                <span className={s.scoreNumber}>{limitNumber(question.score)}</span>
            </span>
            <span className={s.scorePadding}>
                👎
                <span className={s.scoreNumber}>
                    {limitNumber(question.count - question.score)}
                </span>
            </span>
        </div>
    )
}

const List: React.FC<FlashcardComponent> = ({ list }) => {
    const { name } = useParams()
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
                            className={`row ${c.row}`}
                        >
                            <div className={c.flex}>
                                <span
                                    onClick={onQuestionDelete(list, question)}
                                    className={s.deleteIcon}
                                >
                                    🗑️
                                </span>
                                <Link
                                    to={`/${name}/${list.id}/edit/${question.id}`}
                                    className={s.noDecoration}
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
                <Link to={`/${name}/search`}>search</Link>
                {' | '}
                <Link to={`/${name}/${list.id}/add`}>add question</Link>
                {list.questions.length > 0 && (
                    <>
                        {' | '}
                        <Link
                            to={`/${name}/${list.id}/play`}
                            className={s.noDecoration}
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
