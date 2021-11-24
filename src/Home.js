import { useContext } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'

export default function Home() {
    const { lists, delList } = useContext(DataContext)
    const onDelete = (name, idx) => (e) => {
        if (window.confirm(`Delete list ${name} ?`)) delList(idx)
    }
    return (
        <>
            <div className="content">
                {lists.length === 0 && <p>No list</p>}
                {lists.map((list, index) => (
                    <p
                        key={index}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 10fr 1fr',
                            gap: 10,
                        }}
                    >
                        <span
                            onClick={onDelete(list.name, index)}
                            style={{ cursor: 'pointer' }}
                        >
                            🗑️
                        </span>
                        <span>
                            <Link to={`/list/${index}`} style={{ margin: 4 }}>
                                {list.name}
                            </Link>
                            <small style={{ marign: 'auto 10' }}>
                                ({list.words.length} word
                                {list.words.length > 1 ? 's' : ''})
                            </small>
                        </span>
                        {list.words.length ? (
                            <Link
                                to={`/list/${index}/play`}
                                style={{
                                    margin: 'auto 10',
                                    textDecoration: 'none',
                                }}
                            >
                                ▶️
                            </Link>
                        ) : (
                            <span></span>
                        )}
                    </p>
                ))}
            </div>
            <footer>
                <Link to="/list/add">add a list</Link>
            </footer>
        </>
    )
}
