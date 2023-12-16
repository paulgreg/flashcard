import React, { useContext } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './Home'
import List from './List'
import AddOrEditList from './AddOrEditList'
import AddOrEditQuestion from './AddOrEditQuestion'
import Fusion from './Fusion'
import Play from './Play'
import Config from './Config'
import Error from './Error'
import DataContext from './DataContext'
import './index.css'

const validate = (lists, listIdStr, questionIdStr) => (Component) => {
    if (!listIdStr || !listIdStr.match(/\w+/)) return <Error />

    const list = lists.find((list) => String(list.id) === listIdStr)
    if (!list) return <Error />

    let question

    if (questionIdStr) {
        if (!questionIdStr.match(/\w+/)) return <Error />
        question = list.questions.find(
            (question) => String(question.id) === questionIdStr
        )
    }

    return <Component list={list} question={question} />
}

const Validate = ({ component }) => {
    const { lists } = useContext(DataContext)
    const { listId, questionId } = useParams()
    return validate(lists, listId, questionId)(component)
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
                    <Route path="/fusion" element={<Fusion />} />
                    <Route path="/list/add" element={<AddOrEditList />} />
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
                        element={<Validate component={AddOrEditQuestion} />}
                    />
                    <Route
                        path="/list/:listId/edit/:questionId"
                        element={<Validate component={AddOrEditQuestion} />}
                    />
                    <Route
                        path="/list/:listId/play"
                        element={<Validate component={Play} />}
                    />
                    <Route path="/configure" element={<Config />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
