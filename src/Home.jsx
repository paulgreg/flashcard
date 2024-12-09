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
                {lists
                    .sort((l1, l2) => l1.name.localeCompare(l2.name))
                    .map((list) => (
                        <div
                            key={list.id}
                            className="row"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 10fr 1fr',
                                gap: 10,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                }}
                            >
                                <span
                                    onClick={onDelete(list)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '4px',
                                    }}
                                >
                                    🗑️
                                </span>
                                <Link
                                    to={`/list/${list.id}/edit`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    ✏️
                                </Link>
                            </div>
                            <span>
                                <Link
                                    to={`/list/${list.id}`}
                                    style={{ margin: 4 }}
                                >
                                    {list.name}
                                </Link>
                                <small style={{ fontSize: '.7em' }}>
                                    ({list.questions.length})
                                </small>
                            </span>
                            {list.questions.length > 0 ? (
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
                        </div>
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
                {' | '}
                <Link to="/fusion">fusion</Link>
            </footer>
        </>
    )
}
