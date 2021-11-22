import { useContext } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'
import { useParams } from 'react-router-dom'
import Error from './Error'

export default function Home() {
    const { lists } = useContext(DataContext)
    const { index } = useParams()

    if (!index || !index.match(/\d+/)) return <Error />
    const idx = parseInt(index, 10)

    if (idx >= lists.length) return <Error />

    const list = lists[idx]

    return (
        <>
            <div className="content">
                {list.words.length === 0 && <p>No word</p>}
                {list.words.map((word, index) => (
                    <p key={index}> {word} </p>
                ))}
            </div>
            <footer>
                <Link to={`/list/${idx}/add`}>add a word</Link>
            </footer>
        </>
    )
}
