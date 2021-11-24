import { useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataContext from './DataContext'

export default function AddWord({ list, listIdx }) {
    const { addWord } = useContext(DataContext)
    const navigate = useNavigate()
    const inputRef = useRef()

    const onSubmit = (e) => {
        e.preventDefault()
        const value = inputRef.current.value
        if (value.length > 0) {
            addWord(listIdx)(value)
            navigate(`/list/${listIdx}`)
        }
    }

    return (
        <>
            <div className="content">
                <form onSubmit={onSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        name="word"
                        placeholder="A word"
                        minLength="1"
                        autoFocus
                        style={{ width: '90%' }}
                    />
                </form>
            </div>
            <footer>
                <Link to={`/list/${listIdx}`}>cancel</Link>
            </footer>
        </>
    )
}
