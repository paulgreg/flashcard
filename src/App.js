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
    const addWord = (index) => (word) => {
        const newData = lists.map((list, i) => {
            if (i === index)
                return { name: list.name, words: list.words.concat(word) }
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
                addWord,
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
