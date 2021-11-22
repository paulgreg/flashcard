import { useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataContext from './DataContext'
import { useParams } from 'react-router-dom'
import Error from './Error'

export default function AddWord() {
    const { lists, addWord } = useContext(DataContext)
    const { index } = useParams()
    const navigate = useNavigate()
    const inputRef = useRef()

    if (!index || !index.match(/\d+/)) return <Error />
    const idx = parseInt(index, 10)

    if (idx >= lists.length) return <Error />

    const onSubmit = (e) => {
        e.preventDefault()
        const value = inputRef.current.value
        if (value.length > 0) {
            addWord(idx)(value)
            navigate(`/list/${idx}`)
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
                    />
                </form>
            </div>
            <footer>
                <Link to={`/list/${idx}`}>cancel</Link>
            </footer>
        </>
    )
}
