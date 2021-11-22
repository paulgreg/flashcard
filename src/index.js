import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import List from './List'
import AddList from './AddList'
import AddWord from './AddWord'

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter
            basename={process.env.NODE_ENV === 'production' ? '/flashcard' : ''}
        >
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="/list/add" element={<AddList />} />
                    <Route path="/list/:index" element={<List />} />
                    <Route path="/list/:index/add" element={<AddWord />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
)
