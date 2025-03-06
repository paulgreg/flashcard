import { FlashcardQuestion, FlashcardQuestions } from './Types'
import { v4 as uuidv4 } from 'uuid'

export const sortQuestionsByScore = (
    q1: FlashcardQuestion,
    q2: FlashcardQuestion
) => {
    const q1Score = q1?.score ?? 0
    const q2Score = q2?.score ?? 0
    return q1Score - q2Score
}

export const filterNonVisible = (questions: FlashcardQuestions) =>
    questions.filter((q) => q.v ?? true)

export const getId = () => uuidv4()

export const limitNumber = (nb = 0) =>
    nb < 1000 ? nb : `${(nb / 1000).toFixed(0)}k`

export const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timerId: ReturnType<typeof setTimeout> | undefined
    return (...args: Parameters<T>) => {
        if (timerId !== undefined) {
            clearTimeout(timerId)
        }

        timerId = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}
