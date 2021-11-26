import { useState, useCallback, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import DataContext from './DataContext'
import settings from './settings.json'

export default function App() {
    const [lists, setLists] = useState([])
    const [key, setKey] = useState(localStorage.getItem('flashcard-key'))

    const addList = (name) => {
        const newData = [{ name, words: [] }].concat(lists)
        setLists(newData)
        save(newData)
    }
    const addWord = (listIdx) => (word) => {
        const newData = lists.map((list, i) => {
            if (i === listIdx)
                return { name: list.name, words: [word].concat(list.words) }
            return list
        })
        setLists(newData)
        save(newData)
    }
    const delList = (idx) => {
        const newData = [...lists]
        newData.splice(idx, 1)
        setLists(newData)
        save(newData)
    }
    const delWord = (listIdx, wordIdx) => {
        const newData = lists.map((list, i) => {
            if (i === listIdx) {
                const newWords = [...list.words]
                newWords.splice(wordIdx, 1)
                return { name: list.name, words: newWords }
            }
            return list
        })
        setLists(newData)
        save(newData)
    }

    const loadOnline = useCallback(
        async (key) =>
            fetch(`${settings.saveUrl}/${key}.json`).then((response) =>
                response.json()
            ),
        []
    )

    const load = useCallback(async () => {
        const raw = localStorage.getItem('flashcard')
        if (raw) setLists(JSON.parse(raw))
        if (settings.saveOnline) {
            const key = localStorage.getItem('flashcard-key')
            if (key) {
                const json = await loadOnline(key)
                if (json && json instanceof Array) setLists(json)
            }
        }
    }, [loadOnline, setLists])

    const save = (newData) => {
        localStorage.setItem('flashcard', JSON.stringify(newData))
        if (settings.saveOnline) {
            const key = localStorage.getItem('flashcard-key')
            if (key) saveOnline(key, newData)
        }
    }

    const saveOnline = (key, data) =>
        fetch(`${settings.saveUrl}/${key}.json`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

    const initSave = async (key) => {
        setKey(key)
        localStorage.setItem('flashcard-key', key)
        saveOnline(key, lists)
    }
    const initLoad = async (key) => {
        setKey(key)
        localStorage.setItem('flashcard-key', key)
        const json = await loadOnline(key)
        setLists(json)
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <DataContext.Provider
            value={{
                lists,
                addList,
                delList,
                addWord,
                delWord,
                key,
                initLoad,
                initSave,
            }}
        >
            <div className="app">
                <header>
                    <Link to="/">Flashcard</Link>
                </header>
                <Outlet />
            </div>
        </DataContext.Provider>
    )
}
