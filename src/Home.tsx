import React from 'react'
import { Link } from 'react-router-dom'
import { useDataContext } from './DataContext'
import Settings from './settings.json'
import { FlashcardList } from './Types'

const Home = () => {
    const { sortedLists, delList } = useDataContext()

    const onDelete = (list: FlashcardList) => () => {
        const { name, id } = list
        if (window.confirm(`Delete list ${name} ?`)) delList(id)
    }

    return (
        <>
            <div className="content">
                {sortedLists.length === 0 && <p>No list</p>}
                {sortedLists.map((list) => (
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
                            <Link to={`/list/${list.id}`} style={{ margin: 4 }}>
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
                {sortedLists.length > 0 && (
                    <>
                        <Link to="/search">search</Link>
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

export default Home
