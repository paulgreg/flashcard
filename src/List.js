import { useContext } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'

export default function List({ list, listIdx }) {
    const { delWord } = useContext(DataContext)

    const onWordDelete = (listIdx, word, wordIdx) => (e) => {
        if (window.confirm(`Delete word ${word} ?`))
            delWord(listIdx, word, wordIdx)
    }

    return (
        <>
            <div className="content">
                {list.words.length === 0 && <p>No word</p>}
                {list.words.sort().map((word, wordIdx) => (
                    <p
                        key={wordIdx}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 10fr 1fr',
                            gap: 10,
                        }}
                    >
                        <span
                            onClick={onWordDelete(listIdx, word, wordIdx)}
                            style={{ cursor: 'pointer' }}
                        >
                            🗑️
                        </span>
                        {word}
                        <span></span>
                    </p>
                ))}
            </div>
            <footer>
                <Link to={`/list/${listIdx}/add`}>add words</Link>
            </footer>
        </>
    )
}
