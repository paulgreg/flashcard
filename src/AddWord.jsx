import { useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'

export default function AddWord({ list, listIdx }) {
    const { addWord } = useContext(DataContext)
    const inputRef = useRef()

    const onSubmit = (e) => {
        e.preventDefault()
        const value = inputRef.current.value.trim()
        if (value.length > 0) {
            addWord(listIdx)(value)
            inputRef.current.value = ''
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

                {list.words.length === 0 && <p>No word</p>}
                {list.words.map((word, wordIdx) => (
                    <p key={wordIdx}>{word}</p>
                ))}
            </div>
            <footer>
                <Link to={`/list/${listIdx}`}>back</Link>
            </footer>
        </>
    )
}
