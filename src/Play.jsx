import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Play({ list }) {
    const [word, setWord] = useState('tap to play')

    const pickWord = (list = {}) => {
        const { words = [] } = list
        const len = words.length
        if (!len) return ''
        const rnd = Math.floor(Math.random() * len)
        return words[rnd]
    }

    const onClick = () => {
        setWord(pickWord(list))
    }
    return (
        <>
            <div className="content" onClick={onClick}>
                <p
                    style={{
                        height: 'calc(100% - 120px)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '50px',
                        textTransform: 'uppercase',
                    }}
                >
                    {word}
                </p>
            </div>
            <footer>
                <Link to={`/`}>back</Link>
            </footer>
        </>
    )
}
