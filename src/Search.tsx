import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDataContext } from './DataContext'
import { cleanStr } from './utils/string'
import { FlashcardList, FlashcardQuestion } from './Types'
import s from './Search.module.css'
import c from './common.module.css'

const Search = () => {
    const { name } = useParams()
    const { lists, delQuestion } = useDataContext()
    const [term, setTerm] = useState('')

    const onInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement
            setTerm(target.value)
        },
        [setTerm]
    )
    const onQuestionDelete =
        (list: FlashcardList, question: FlashcardQuestion) => () => {
            if (window.confirm(`Delete question ${question.q} ?`))
                delQuestion(list.id, question.id)
        }

    const filterTerm = term?.length >= 3 ? cleanStr(term) : ''

    const results = useMemo(
        () =>
            lists
                .map((list) => ({
                    ...list,
                    questions:
                        filterTerm.length === 0
                            ? []
                            : list.questions.filter(
                                  ({ q, a }) =>
                                      cleanStr(q).includes(filterTerm) ||
                                      cleanStr(a).includes(filterTerm)
                              ),
                }))
                .filter(
                    ({ name, questions }) =>
                        cleanStr(name).includes(filterTerm) || questions.length
                ),
        [lists, filterTerm]
    )

    return (
        <>
            <div className="content">
                <input
                    type="text"
                    placeholder="word"
                    className={s.searchInput}
                    value={term}
                    minLength={1}
                    autoFocus
                    required
                    onChange={onInputChange}
                />
                {lists.length === 0 && <p>No list</p>}
                {results.map((list) => (
                    <>
                        <div
                            key={list.id}
                            className={`rowPassive ${c.row}`}
                        >
                            <div className={c.flex}></div>
                            <h3 className={s.title}>{list.name}</h3>
                            <span></span>
                        </div>
                        {list.questions.map((question) => (
                            <div
                                key={question.id}
                                className={`row ${c.row}`}
                            >
                                <div className={c.flex}>
                                    <span
                                        onClick={onQuestionDelete(
                                            list,
                                            question
                                        )}
                                        className={s.deleteIcon}
                                    >
                                        🗑️
                                    </span>
                                </div>
                                <span>
                                    <span className={s.questionText}>
                                        {question.q} → {question.a}
                                    </span>
                                </span>
                                <span></span>
                            </div>
                        ))}
                    </>
                ))}
            </div>
            <footer>
                <Link to={`/${name}`}>home</Link>
            </footer>
        </>
    )
}

export default Search
