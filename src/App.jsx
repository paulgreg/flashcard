import { useState, useCallback, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import DataContext from './DataContext'
import settings from './settings.json'
import { getId, throttle } from './utils'

export default function App() {
    const [lists, setLists] = useState([])
    const [key, setKey] = useState(localStorage.getItem('flashcard-key'))

    const addList = (name) => {
        const newData = [{ id: getId(), name, questions: [] }].concat(lists)
        setLists(newData)
        save(newData)
    }
    const addQuestion = (listId) => (q, a) => {
        const newData = lists.map((list) => {
            if (listId === list.id)
                return {
                    ...list,
                    questions: [
                        {
                            id: getId(),
                            q,
                            a,
                        },
                    ].concat(list.questions),
                }
            return list
        })
        setLists(newData)
        save(newData)
    }
    const delList = (listId) => {
        const newData = lists.filter((list) => list.id !== listId)
        setLists(newData)
        save(newData)
    }

    const setScore = (listId, questionId, score) => {
        const newData = lists.map((list) => {
            if (list.id === listId) {
                const newQuestions = list.questions.map((question) => {
                    return question.id === questionId
                        ? {
                              ...question,
                              count: question.count ? question.count + 1 : 1,
                              score: question.score
                                  ? question.score + score
                                  : score,
                          }
                        : question
                })
                return { ...list, questions: newQuestions }
            }
            return list
        })
        setLists(newData)
        save(newData)
    }

    const delQuestion = (listId, questionId) => {
        const newData = lists.map((list) => {
            if (listId === list.id) {
                return {
                    ...list,
                    questions: list.questions.filter(
                        (question) => question.id !== questionId
                    ),
                }
            }
            return list
        })
        setLists(newData)
        save(newData)
    }

    const loadOnline = useCallback(
        async (key) =>
            fetch(`${settings.saveUrl}/${key}.json`, {
                headers: {
                    Authorization: `Basic ${settings.authorization}`,
                },
            })
                .then((response) => {
                    if (response.ok) return response.json()
                    if (response.status === 404) {
                        return []
                    }
                })
                .catch((e) => {
                    console.error(e)
                    alert('error while loading json')
                }),
        []
    )

    const load = useCallback(async () => {
        const raw = localStorage.getItem('flashcard')
        if (raw) setLists(JSON.parse(raw))
        if (settings.saveOnline) {
            const key = localStorage.getItem('flashcard-key')
            if (key) {
                const json = await loadOnline(key)
                if (json && json instanceof Array) setLists(json)
            }
        }
    }, [loadOnline, setLists])

    const save = (newData) => {
        localStorage.setItem('flashcard', JSON.stringify(newData))
        if (settings.saveOnline) {
            const key = localStorage.getItem('flashcard-key')
            if (key) saveOnline(key, newData)
        }
    }

    const saveOnline = throttle(
        (key, data) =>
            fetch(`${settings.saveUrl}/${key}.json`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    Authorization: `Basic ${settings.authorization}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }),
        2500
    )

    const initSave = async (key) => {
        setKey(key)
        localStorage.setItem('flashcard-key', key)
        saveOnline(key, lists)
    }
    const initLoad = async (key) => {
        setKey(key)
        localStorage.setItem('flashcard-key', key)
        const json = await loadOnline(key)
        setLists(json)
    }

    useEffect(() => {
        load()
    }, [load])

    return (
        <DataContext.Provider
            value={{
                lists,
                addList,
                delList,
                addQuestion,
                delQuestion,
                setScore,
                key,
                initLoad,
                initSave,
            }}
        >
            <div className="app">
                <header>
                    <Link to="/">Flashcard</Link>
                </header>
                <Outlet />
            </div>
        </DataContext.Provider>
    )
}
