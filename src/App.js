import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import DataContext from './DataContext'

const load = () => {
    const raw = localStorage.getItem('flashcard')
    if (raw) return JSON.parse(raw)
    return []
}
const save = (data) => localStorage.setItem('flashcard', JSON.stringify(data))

export default function App() {
    const [lists, setLists] = useState(load())

    const addList = (name) => {
        const newData = lists.concat({ name, words: [] })
        setLists(newData)
        save(newData)
    }
    const addWord = (listIdx) => (word) => {
        const newData = lists.map((list, i) => {
            if (i === listIdx)
                return { name: list.name, words: list.words.concat(word) }
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

    return (
        <DataContext.Provider
            value={{
                lists,
                addList,
                delList,
                addWord,
                delWord,
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
