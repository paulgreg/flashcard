import { useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataContext from './DataContext'

export default function AddList() {
    const { addList } = useContext(DataContext)
    const navigate = useNavigate()
    const inputRef = useRef()

    const onSubmit = (e) => {
        e.preventDefault()
        const value = inputRef.current.value.trim()
        if (value.length > 0) {
            addList(value)
            navigate('/')
        }
    }

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
