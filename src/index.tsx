import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import List from './List'
import AddOrEditList from './AddOrEditList'
import AddOrEditQuestion from './AddOrEditQuestion'
import Fusion from './Fusion'
import Play from './Play'
import Config from './Config'
import DataContextProvider from './DataContextProvider'
import Search from './Search'
import Validate from './validate'

const container: HTMLElement | null = document.getElementById('root')
if (container) {
    const root = createRoot(container)
    root.render(
        <React.StrictMode>
            <DataContextProvider>
                <BrowserRouter
                    basename={
                        process.env.NODE_ENV === 'production'
                            ? '/flashcard'
                            : ''
                    }
                >
                    <Routes>
                        <Route path="/" element={<App />}>
                            <Route index element={<Home />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/fusion" element={<Fusion />} />
                            <Route
                                path="/list/add"
                                element={<AddOrEditList />}
                            />
                            <Route
                                path="/list/:listId"
                                element={<Validate component={List} />}
                            />
                            <Route
                                path="/list/:listId/edit"
                                element={<Validate component={AddOrEditList} />}
                            />
                            <Route
                                path="/list/:listId/add"
                                element={
                                    <Validate component={AddOrEditQuestion} />
                                }
                            />
                            <Route
                                path="/list/:listId/edit/:questionId"
                                element={
                                    <Validate component={AddOrEditQuestion} />
                                }
                            />
                            <Route
                                path="/list/:listId/play"
                                element={<Validate component={Play} />}
                            />
                            <Route path="/configure" element={<Config />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </DataContextProvider>
        </React.StrictMode>
    )
}
