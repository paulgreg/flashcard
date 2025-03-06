import React, { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useDataContext } from './DataContext'

export default function App() {
    const { load } = useDataContext()

    useEffect(() => {
        load()
    }, [load])

    return (
        <div className="app">
            <header>
                <Link to="/">Flashcard</Link>
            </header>
            <Outlet />
        </div>
    )
}
