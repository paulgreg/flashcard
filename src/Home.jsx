import { useContext } from 'react'
import { Link } from 'react-router-dom'
import DataContext from './DataContext'
import Settings from './settings.json'

export default function Home() {
    const { lists, delList } = useContext(DataContext)
    const onDelete =
        ({ name, id }) =>
        () => {
            if (window.confirm(`Delete list ${name} ?`)) delList(id)
        }
    return (
        <>
            <div className="content">
                {lists.length === 0 && <p>No list</p>}
                {lists.map((list) => (
                    <p
                        key={list.id}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 10fr 1fr',
                            gap: 10,
                        }}
                    >
                        <span
                            onClick={onDelete(list)}
                            style={{
                                margin: 'auto 0 auto 8px',
                                cursor: 'pointer',
                            }}
                        >
                            🗑️
                        </span>
                        <span>
                            <Link to={`/list/${list.id}`} style={{ margin: 4 }}>
                                {list.name}
                            </Link>
                            <small style={{ marign: 'auto 10' }}>
                                ({list.questions.length} question
                                {list.questions.length > 1 ? 's' : ''})
                            </small>
                        </span>
                        {list.questions.length ? (
                            <Link
                                to={`/list/${list.id}/play`}
                                style={{
                                    margin: 'auto 8px auto 0',
                                    textDecoration: 'none',
                                }}
                            >
                                ▶
                            </Link>
                        ) : (
                            <span></span>
                        )}
                    </p>
                ))}
            </div>
            <footer>
                {Settings.saveOnline && (
                    <>
                        <Link to="/configure">configure</Link>
                        {' | '}
                    </>
                )}
                <Link to="/list/add">add a list</Link>
            </footer>
        </>
    )
}
