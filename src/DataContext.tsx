import { createContext, useContext } from 'react'
import {
    FlashcardLists,
    FlashcardPartialQuestion,
    FlashcardQuestion,
    FlashcardQuestions,
} from './Types'

export type DataContextType = {
    lists: FlashcardLists
    addList: (name: string, questions?: FlashcardQuestions) => void
    editList: (id: string, name: string) => void
    delList: (listId: string) => void
    addQuestion: (
        listId: string
    ) => (question: FlashcardPartialQuestion) => void
    editQuestion: (listId: string) => (question: FlashcardQuestion) => void
    delQuestion: (listId: string, questionId: string) => void
    setScore: (listId: string, questionId: string, score: number) => void
}

export const useDataContext = () => useContext(DataContext)

export const DataContext = createContext<DataContextType>({} as DataContextType)
