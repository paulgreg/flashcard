import React, {
    useCallback,
    FormEvent,
    useRef,
    MouseEvent,
    useState,
    useEffect,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import settings from './settings.json'
import { PREFIX } from './utils/constants'

const requestRawListNames = async () => {
    const url = `${settings.crdtUrl}list?prefix=${PREFIX}&secret=${settings.secret}`
    const response = await fetch(url)
    if (response.ok) return await response.json()
    return []
}

const deleteList = async (docName: string) => {
    const url = `${settings.crdtUrl}del?doc=${docName}&secret=${settings.secret}`
    const response = await fetch(url)
    if (response.ok) return await response.json()
    return false
}

const formatRawListName = (rawDocName = '') =>
    decodeURIComponent(rawDocName.split(`${PREFIX}:`)[1])

const Home = () => {
    const [rawListNames, setRawListNames] = useState([])
    const inputRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()

    const fillListNames = async () => {
        if (settings.saveOnline) {
            setRawListNames(await requestRawListNames())
        }
    }

    useEffect(() => {
        fillListNames()
    }, [])

    const onSubmitListNameForm = useCallback(
        (e: FormEvent) => {
            e.preventDefault()
            const name = inputRef.current?.value ?? ''
            if (name) {
                navigate(`/${name}`)
            }
        },
        [navigate]
    )
    const onDeleteList = useCallback(
        (rawName: string) => (e: MouseEvent) => {
            e.preventDefault()
            if (confirm(`delete ${formatRawListName(rawName)} ?`)) {
                deleteList(rawName)
                fillListNames()
            }
        },
        []
    )

    return (
        <>
            <div className="content">
                <form className="homeForm" onSubmit={onSubmitListNameForm}>
                    <input
                        ref={inputRef}
                        type="text"
                        name="name"
                        className=""
                        placeholder="English"
                        required
                        autoFocus
                        pattern="^[^\s\t]+$"
                        minLength={2}
                        maxLength={20}
                    ></input>
                    <button>go</button>
                </form>
                {rawListNames?.map((name) => (
                    <div
                        key={name}
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
                                onClick={onDeleteList(name)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '4px',
                                }}
                            >
                                🗑️
                            </span>
                        </div>
                        <span>
                            <Link
                                to={`/${formatRawListName(name)}`}
                                className={'listLink'}
                            >
                                {formatRawListName(name)}
                            </Link>
                        </span>
                        <span></span>
                    </div>
                ))}
            </div>
            <footer></footer>
        </>
    )
}

export default Home
