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
import { formatRawListName } from './utils/string'

const requestRawListNames = async (): Promise<string[]> => {
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

type HomeItemProps = {
    name: string
    onDeleteList: (rawName: string) => (e: MouseEvent) => void
}
const HomeItem: React.FC<HomeItemProps> = ({ name, onDeleteList }) => {
    const formatedName = formatRawListName(name)
    return (
        <div
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
                <Link to={`/${formatedName}`} className={'listLink'}>
                    {formatedName}
                </Link>
            </span>
            <span></span>
        </div>
    )
}

const Home = () => {
    const [rawListNames, setRawListNames] = useState<string[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()

    const fillListNames = async () => {
        if (settings.saveOnline) {
            const lists = await requestRawListNames()
            setRawListNames(lists.toSorted((a, b) => a.localeCompare(b)))
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
                        minLength={2}
                        maxLength={20}
                    ></input>
                    <button>go</button>
                </form>
                {rawListNames?.map((name) => (
                    <HomeItem
                        key={name}
                        name={name}
                        onDeleteList={onDeleteList}
                    />
                ))}
            </div>
            <footer></footer>
        </>
    )
}

export default Home
