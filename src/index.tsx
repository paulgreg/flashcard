import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ListHome from './ListHome'
import List from './List'
import AddOrEditList from './AddOrEditList'
import AddOrEditQuestion from './AddOrEditQuestion'
import Fusion from './Fusion'
import Play from './Play'
import Search from './Search'
import Validate from './validate'
import Home from './Home'

const container: HTMLElement | null = document.getElementById('root')
if (container) {
    const root = createRoot(container)
    root.render(
        <React.StrictMode>
            <BrowserRouter
                basename={
                    process.env.NODE_ENV === 'production' ? '/flashcard' : ''
                }
            >
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route index element={<Home />} />
                        <Route path="/:name" element={<ListHome />} />
                        <Route path="/:name/search" element={<Search />} />
                        <Route path="/:name/fusion" element={<Fusion />} />
                        <Route path="/:name/add" element={<AddOrEditList />} />
                        <Route
                            path="/:name/:listId/"
                            element={<Validate component={List} />}
                        />
                        <Route
                            path="/:name/:listId/edit"
                            element={<Validate component={AddOrEditList} />}
                        />
                        <Route
                            path="/:name/:listId/add"
                            element={<Validate component={AddOrEditQuestion} />}
                        />
                        <Route
                            path="/:name/:listId/edit/:questionId"
                            element={<Validate component={AddOrEditQuestion} />}
                        />
                        <Route
                            path="/:name/:listId/play"
                            element={<Validate component={Play} />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    )
}
