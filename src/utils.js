export const sortQuestionsByScore = (q1, q2) => {
    const q1Score = (q1?.score ?? 0) / (q1.count ?? 1)
    const q2Score = (q2?.score ?? 0) / (q2.count ?? 1)
    return q1Score - q2Score
}

export const computeRatio = (q) => {
    if (q?.score === undefined || q?.count === undefined) return
    const ratio = ((q.score / q.count) * 100).toFixed(0)
    return `${ratio} %`
}

export const getId = () => Date.now()

export const throttle = (fn, timeout = 1000) => {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(fn(...args), timeout)
    }
}
