import { useCallback, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataContext from './DataContext'
import { getId } from './utils'

export default function Fusion() {
    const { lists, addList } = useContext(DataContext)
    const [selection, setSelection] = useState([])
    const [listName, setListName] = useState('')
    const navigate = useNavigate()

    const onCheckboxChange = useCallback(
        (listId) => (e) => {
            e.stopPropagation()
            setSelection((selection) => {
                if (selection.includes(listId)) {
                    return selection.filter((id) => id !== listId)
                } else {
                    return selection.concat(listId)
                }
            })
        },
        [setSelection]
    )
    const onInputChange = useCallback(
        (e) => {
            setListName(e.target.value)
        },
        [setListName]
    )
    const onFormSubmit = useCallback(
        (e) => {
            e.preventDefault()
            const listsToFusion = lists.filter(({ id }) =>
                selection.includes(id)
            )
            debugger
            const questions = listsToFusion
                .flatMap(({ questions }) => questions)
                .map((question) => ({
                    ...question,
                    id: getId(),
                }))
            addList(listName, questions)
            navigate('/')
        },
        [lists, listName, selection]
    )
    return (
        <>
            <div className="content">
                <form onSubmit={onFormSubmit}>
                    <p>Create a new list with questions from lists</p>
                    {lists.length === 0 && <p>No list</p>}
                    {lists
                        .sort((l1, l2) => l1.name.localeCompare(l2.name))
                        .map((list) => (
                            <div
                                key={list.id}
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
                                ></div>
                                <label htmlFor={list.id}>
                                    <span style={{ margin: 4 }}>
                                        {list.name}
                                    </span>
                                    <small style={{ fontSize: '.7em' }}>
                                        ({list.questions.length})
                                    </small>
                                </label>
                                <input
                                    type="checkbox"
                                    id={list.id}
                                    value={list.id}
                                    onChange={onCheckboxChange(list.id)}
                                    disabled={list.questions.length === 0}
                                />
                            </div>
                        ))}
                    <input
                        type="text"
                        placeholder="new list name"
                        style={{ margin: '1em' }}
                        value={listName}
                        minLength="1"
                        required
                        onChange={onInputChange}
                    />
                    <button
                        style={{ margin: 'auto' }}
                        disabled={
                            listName.length === 0 || selection.length === 0
                        }
                    >
                        Create
                    </button>
                </form>
            </div>
            <footer>
                <Link to="/">home</Link>
            </footer>
        </>
    )
}
