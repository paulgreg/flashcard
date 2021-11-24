import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './Home'
import List from './List'
import AddList from './AddList'
import AddWord from './AddWord'
import Play from './Play'
import Error from './Error'
import DataContext from './DataContext'

const validate = (lists, index) => (Component) => {
    if (!index || !index.match(/\d+/)) return <Error />
    const idx = parseInt(index, 10)

    if (idx >= lists.length) return <Error />

    const list = lists[idx]
    return <Component list={list} listIdx={idx} />
}

const Validate = ({ component }) => {
    const { lists } = useContext(DataContext)
    const { index } = useParams()
    return validate(lists, index)(component)
}

ReactDOM.render(
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
                        element={<Validate component={AddWord} />}
                    />
                    <Route
                        path="/list/:index/play"
                        element={<Validate component={Play} />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
)
