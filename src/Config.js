import { useState, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataContext from './DataContext'

export default function Home() {
    const inputRef = useRef()
    const navigate = useNavigate()
    const [error, setError] = useState()
    const { key, initLoad, initSave } = useContext(DataContext)

    const commonCheck = (e) => {
        e.preventDefault()
        if (!inputRef.current.value) {
            setError('Empty value')
            return false
        }
        if (!inputRef.current.checkValidity()) {
            setError('Bad format')
            return false
        }
        setError(undefined)
        return true
    }

    const onLoad = (e) => {
        if (commonCheck(e)) {
            initLoad(inputRef.current.value)
            navigate('/')
        }
    }
    const onSave = (e) => {
        if (commonCheck(e)) {
            initSave(inputRef.current.value)
            navigate('/')
        }
    }
    return (
        <>
            <div className="content">
                <form>
                    <label>
                        Type a collection name :
                        <input
                            ref={inputRef}
                            type="text"
                            name="key"
                            defaultValue={key}
                            placeholder="bob"
                            minLength="3"
                            maxLength="32"
                            pattern="[a-zA-Z0-9]+"
                            style={{ width: '90%' }}
                            autoFocus
                        />
                        {error && (
                            <strong
                                style={{ display: 'block', color: '#fc997c' }}
                            >
                                {error}
                            </strong>
                        )}
                        <small>
                            (only letters or number without space or special
                            characters)
                        </small>
                    </label>
                    <p>
                        <button
                            style={{ margin: '1em auto 0' }}
                            onClick={onLoad}
                        >
                            Load
                        </button>
                        <small>
                            (will fetch data from server and overwrite your
                            local data if any)
                        </small>
                        <button
                            style={{ margin: '1em auto 0' }}
                            onClick={onSave}
                        >
                            Save
                        </button>
                        <small>
                            (will save your local data on server and overwrite
                            them on server if any)
                        </small>
                    </p>
                </form>
            </div>
            <footer>
                <Link to="/">back</Link>
            </footer>
        </>
    )
}
