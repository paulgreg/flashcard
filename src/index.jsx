import React, { useContext } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './Home'
import List from './List'
import AddList from './AddList'
import AddQuestion from './AddQuestion'
import Play from './Play'
import Config from './Config'
import Error from './Error'
import DataContext from './DataContext'
import './index.css'

const validate = (lists, idStr) => (Component) => {
    if (!idStr || !idStr.match(/\d+/)) return <Error />
    const id = parseInt(idStr, 10)

    const list = lists.find((list) => list.id === id)
    if (!list) return <Error />

    return <Component list={list} />
}

const Validate = ({ component }) => {
    const { lists } = useContext(DataContext)
    const { index } = useParams()
    return validate(lists, index)(component)
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
    <React.StrictMode>
        <BrowserRouter
            basename={process.env.NODE_ENV === 'production' ? '/flashcard' : ''}
        >
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="/list/add" element={<AddList />} />
                    <Route
                        path="/list/:index"
                        element={<Validate component={List} />}
                    />
                    <Route
                        path="/list/:index/add"
                        element={<Validate component={AddQuestion} />}
                    />
                    <Route
                        path="/list/:index/play"
                        element={<Validate component={Play} />}
                    />
                    <Route path="/configure" element={<Config />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
