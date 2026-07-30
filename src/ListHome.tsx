import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDataContext } from './DataContext'
import { FlashcardList } from './Types'
import s from './ListHome.module.css'
import c from './common.module.css'

const ListHome = () => {
    const { name } = useParams()
    const { lists, delList } = useDataContext()

    const onDelete = (list: FlashcardList) => () => {
        const { name, id } = list
        if (window.confirm(`Delete list ${name} ?`)) delList(id)
    }

    return (
        <>
            <div className="content">
                {lists.length === 0 && <p>No list</p>}
                {lists.map((list) => (
                    <div
                        key={list.id}
                        className={`row ${c.row}`}
                    >
                        <div className={c.flex}>
                            <span
                                onClick={onDelete(list)}
                                className={s.deleteIcon}
                            >
                                🗑️
                            </span>
                            <Link
                                to={`/${name}/${list.id}/edit`}
                                className={s.noDecoration}
                            >
                                ✏️
                            </Link>
                        </div>
                        <span>
                            <Link
                                to={`/${name}/${list.id}`}
                                className={s.listLink}
                            >
                                {list.name}
                            </Link>
                            <small className={s.listCount}>
                                ({list.questions.length})
                            </small>
                        </span>
                        {list.questions.length > 0 ? (
                            <Link to={`/${name}/${list.id}/play`} className={s.playLink}>
                                ▶
                            </Link>
                        ) : (
                            <span></span>
                        )}
                    </div>
                ))}
            </div>
            <footer>
                {lists.length > 0 && (
                    <>
                        <Link to={`/${name}/search`}>search</Link>
                        {' | '}
                    </>
                )}
                <Link to={`/${name}/add`}>add a list</Link>
                {' | '}
                <Link to={`/${name}/fusion`}>fusion</Link>
            </footer>
        </>
    )
}

export default ListHome
