import React from 'react'
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
import DataContextProvider, { useDataContext } from './DataContext'
import { FlashcardComponent, FlashcardLists } from './Types'
import ErrorMessage from './Error'
import './index.css'

type ValidateType = {
    component: React.FC<FlashcardComponent>
}

const validate =
    (lists: FlashcardLists, listIdStr?: string, questionIdStr?: string) =>
    (Component: React.FC<FlashcardComponent>) => {
        if (!listIdStr || !RegExp(/\w+/).exec(listIdStr))
            return <ErrorMessage msg="bad list parameter" />

        const list = lists.find((list) => String(list.id) === listIdStr)
        if (!list) return <ErrorMessage msg="list not found" />

        let question

        if (questionIdStr) {
            if (!RegExp(/\w+/).exec(questionIdStr))
                return <ErrorMessage msg="bad question parameter" />
            question = list.questions.find(
                (question) => String(question.id) === questionIdStr
            )
        }

        return <Component list={list} question={question} />
    }

const Validate: React.FC<ValidateType> = ({ component }) => {
    const { lists } = useDataContext()
    const { listId, questionId } = useParams()
    return validate(lists, listId, questionId)(component)
}

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
