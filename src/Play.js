import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react/cjs/react.development'

export default function Play({ list }) {
    const [word, setWord] = useState('')
    const [style, setStyle] = useState({})

    const pickWord = (list) => {
        const { words } = list
        const len = words.length
        const rnd = Math.floor(Math.random() * len)
        return words[rnd]
    }

    const pickStyle = () => {
        const rnd = Math.floor(Math.random() * 3)
        const defaultStyle = {
            fontSize: '50px',
        }
        if (rnd < 1) return { ...defaultStyle, textTransform: 'uppercase' }
        else if (rnd < 2)
            return {
                ...defaultStyle,
                fontSize: '60px',
                fontFamily: 'Cedarville Cursive',
            }
        return defaultStyle
    }

    useEffect(() => {
        setStyle(pickStyle())
        setWord(pickWord(list))
    }, [list])

    const onClick = () => {
        setStyle(pickStyle())
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
                        ...style,
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
