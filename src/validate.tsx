import React from 'react'
import { useParams } from 'react-router-dom'
import { useDataContext } from './DataContext'
import { FlashcardComponent, FlashcardLists } from './Types'
import ErrorMessage from './Error'

type ValidateType = {
    component: React.FC<FlashcardComponent>
}

const validate =
    (
        name?: string,
        lists?: FlashcardLists,
        listIdStr?: string,
        questionIdStr?: string
    ) =>
    (Component: React.FC<FlashcardComponent>) => {
        if (!name || !RegExp(/\w+/).exec(name))
            return <ErrorMessage msg="bad nameparameter" />

        if (!listIdStr || !RegExp(/\w+/).exec(listIdStr))
            return <ErrorMessage msg="bad list parameter" />

        const list = lists?.find((list) => String(list.id) === listIdStr)
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
    const { name, listId, questionId } = useParams()
    return validate(name, lists, listId, questionId)(component)
}

export default Validate
