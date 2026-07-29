import { FlashcardQuestion } from './Types'
import { v4 as uuidv4 } from 'uuid'

export const sortQuestionsByScore = (
    q1: FlashcardQuestion,
    q2: FlashcardQuestion
) => {
    // True new questions (never played) come first
    const q1New = (q1?.count ?? 0) === 0
    const q2New = (q2?.count ?? 0) === 0

    if (q1New && !q2New) return -1
    if (!q1New && q2New) return 1

    // Then sort by score (ascending)
    const q1Score = q1?.score ?? 0
    const q2Score = q2?.score ?? 0
    return q1Score - q2Score
}

export const getId = () => uuidv4()

export const limitNumber = (nb = 0) =>
    nb < 1000 ? nb : `${(nb / 1000).toFixed(0)}k`
