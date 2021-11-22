import { useContext } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'

export default function Home() {
    const { lists } = useContext(DataContext)
    return (
        <>
            <div className="content">
                {lists.length === 0 && <p>No list</p>}
                {lists.map((list, index) => (
                    <p key={index}>
                        <Link to={`/list/${index}`} style={{ margin: 4 }}>
                            {list.name}
                        </Link>
                        <small>({list.words.length})</small>
                    </p>
                ))}
            </div>
            <footer>
                <Link to="/list/add">add a list</Link>
            </footer>
        </>
    )
}
