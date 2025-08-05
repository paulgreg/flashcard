import * as Y from 'yjs'

export type FlashcardPartialQuestion = {
    q: string
    a: string
}

export type FlashcardQuestion = FlashcardPartialQuestion & {
    id: string
    count?: number
    score?: number
}

export type FlashcardQuestions = Array<FlashcardQuestion>

export type FlashcardList = {
    id: string
    name: string
    questions: FlashcardQuestions
}

export type FlashcardLists = Array<FlashcardList>

export type FlashcardComponent = {
    list: FlashcardList
    question?: FlashcardQuestion
}

export type YFlashcardQuestion = string | number

export type YFlashcardList = string | Y.Array<Y.Map<YFlashcardQuestion>>
