import React, { useEffect, useCallback, useRef, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDataContext } from './DataContext'
import { FlashcardList } from './Types'

const AddOrEditList: React.FC<{ list?: FlashcardList }> = ({ list }) => {
    const { addList, editList } = useDataContext()
    const navigate = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null)

    const onSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (!inputRef.current) return
            const value = inputRef.current.value.trim()
            if (value.length > 0) {
                if (list?.id) editList(list.id, value)
                else addList(value)
                navigate('/')
            }
        },
        [addList, editList, list?.id, navigate]
    )

    useEffect(() => {
        if (!inputRef.current) return
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
                        minLength={1}
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

export default AddOrEditList
