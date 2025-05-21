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
