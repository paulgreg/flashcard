export const sortQuestionsByScore = (q1, q2) => {
    const q1Score = q1?.score ?? 0
    const q2Score = q2?.score ?? 0
    return q1Score - q2Score
}

export const filterNonVisible = (questions) =>
    questions.filter((q) => q.v ?? true)

export const getId = () => Date.now()

export const limitNumber = (nb = 0) =>
    nb < 1000 ? nb : `${(nb / 1000).toFixed(0)}k`

export const debounce = (fn, delay) => {
    let timerId

    return function (...args) {
        clearTimeout(timerId)

        timerId = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}
