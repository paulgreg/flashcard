import { useEffect, useContext, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataContext from './DataContext'

export default function AddOrEditList({ list }) {
    const { addList, editList } = useContext(DataContext)
    const navigate = useNavigate()
    const inputRef = useRef()

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault()
            const value = inputRef.current.value.trim()
            if (value.length > 0) {
                if (list?.id) editList(list.id, value)
                else addList(value)
                navigate('/')
            }
        },
        [list]
    )

    useEffect(() => {
        if (list) inputRef.current.value = list.name
    }, [list])

    return (
        <>
            <div className="content">
                <form onSubmit={onSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        name="list"
                        placeholder="list name"
                        minLength="1"
                        autoFocus
                        style={{ width: '90%' }}
                    />
                </form>
            </div>
            <footer>
                <Link to="/">cancel</Link>
            </footer>
        </>
    )
}
