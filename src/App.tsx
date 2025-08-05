import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function App() {
    return (
        <div className="app">
            <header>
                <Link to="/">Flashcard</Link>
            </header>
            <Outlet />
        </div>
    )
}
