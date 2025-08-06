import React from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import DataContextProvider from './DataContextProvider'

type InnerAppProps = {
    name?: string
}

const InnerApp: React.FC<InnerAppProps> = ({ name }) => (
    <div className="app">
        <header>
            <Link to="/">Flashcard</Link>
            {name && (
                <>
                    | <Link to={`/${name}`}>home</Link>
                </>
            )}
        </header>
        <Outlet />
    </div>
)

export default function App() {
    const { name } = useParams()

    if (name) {
        return (
            <DataContextProvider name={name}>
                <InnerApp name={name} />
            </DataContextProvider>
        )
    }
    return <InnerApp />
}
