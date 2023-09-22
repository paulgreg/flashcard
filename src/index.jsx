import React, { useContext } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './Home'
import List from './List'
import AddOrEditList from './AddOrEditList'
import AddOrEditQuestion from './AddOrEditQuestion'
import Play from './Play'
import Config from './Config'
import Error from './Error'
import DataContext from './DataContext'
import './index.css'

const validate = (lists, listIdStr, questionIdStr) => (Component) => {
    if (!listIdStr || !listIdStr.match(/\d+/)) return <Error />
    const listId = parseInt(listIdStr, 10)

    const list = lists.find((list) => list.id === listId)
    if (!list) return <Error />

    let question

    if (questionIdStr) {
        if (!questionIdStr.match(/\d+/)) return <Error />
        const questionId = parseInt(questionIdStr, 10)
        question = list.questions.find((question) => question.id === questionId)
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
