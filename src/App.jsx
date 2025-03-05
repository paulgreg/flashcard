import { useState, useCallback, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import DataContext from './DataContext'
import settings from './settings.json'
import { getId, debounce } from './utils'
import * as jsonpatch from 'fast-json-patch'

const DEBOUNCE_SAVE_TIME = 2000

export default function App() {
    const [lists, setLists] = useState([])
    const [previousLists, setPreviousLists] = useState([])
    const [newDoc, setNewDoc] = useState(true)
    const [key, setKey] = useState(localStorage.getItem('flashcard-key'))

    const addList = useCallback(
        (name, questions = []) => {
            const newData = [{ id: getId(), name, questions }].concat(lists)
            setLists(newData)
            save(newData, previousLists, newDoc)
        },
        [lists, previousLists, newDoc]
    )

    const editList = useCallback(
        (id, name) => {
            const newData = lists.map((list) =>
                list.id === id ? { ...list, name } : list
            )
            setLists(newData)
            save(newData, previousLists, newDoc)
        },
        [lists, previousLists, newDoc]
    )

    const addQuestion = useCallback(
        (listId) =>
            (q, a, v = true) => {
                const newData = lists.map((list) =>
                    listId === list.id
                        ? {
                              ...list,
                              questions: [
                                  {
                                      id: getId(),
                                      q,
                                      a,
                                      v,
                                  },
                              ].concat(list.questions),
                          }
                        : list
                )
                setLists(newData)
                save(newData, previousLists, newDoc)
            },
        [lists, previousLists, newDoc]
    )
    const editQuestion = useCallback(
        (listId) => (questionId, q, a, v) => {
            const newData = lists.map((list) =>
                listId === list.id
                    ? {
                          ...list,
                          questions: list.questions.map((question) =>
                              question.id === questionId
                                  ? {
                                        ...question,
                                        a,
                                        q,
                                        v,
                                    }
                                  : question
                          ),
                      }
                    : list
            )
            setLists(newData)
            save(newData, previousLists, newDoc)
        },
        [lists, previousLists, newDoc]
    )
    const delList = useCallback(
        (listId) => {
            const newData = lists.filter((list) => list.id !== listId)
            setLists(newData)
            save(newData)
            save(newData, previousLists, newDoc)
        },
        [lists, previousLists, newDoc]
    )

    const setScore = useCallback(
        (listId, questionId, score) => {
            const newData = lists.map((list) => {
                if (list.id === listId) {
                    const newQuestions = list.questions.map((question) => {
                        return question.id === questionId
                            ? {
                                  ...question,
                                  count: question.count
                                      ? question.count + 1
                                      : 1,
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
            save(newData, previousLists, newDoc)
        },
        [lists, previousLists, newDoc]
    )

    const delQuestion = useCallback(
        (listId, questionId) => {
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
            save(newData, previousLists, newDoc)
        },
        [lists, previousLists, newDoc]
    )

    const loadOnline = useCallback(
        async (key) =>
            fetch(`${settings.saveUrl}/${key}.json`, {
                headers: {
                    Authorization: `Basic ${settings.authorization}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        setNewDoc(false)
                        return response.json()
                    }
                    if (response.status === 404) {
                        setNewDoc(true)
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
        let serverData, localData
        if (settings.saveOnline) {
            const key = localStorage.getItem('flashcard-key')
            if (key) {
                const json = await loadOnline(key)
                if (json && json instanceof Array) serverData = json
            }
        }

        const raw = localStorage.getItem('flashcard')
        if (raw) localData = JSON.parse(raw)

        setLists(serverData ?? localData ?? [])
        setPreviousLists(serverData ?? [])
    }, [loadOnline, setLists])

    const save = (newData, previousData, newDoc) => {
        localStorage.setItem('flashcard', JSON.stringify(newData))
        if (settings.saveOnline) {
            const key = localStorage.getItem('flashcard-key')
            if (key) saveOnline(key, newData, previousData, newDoc)
        }
    }

    const saveOnline = useCallback(
        debounce((key, data, previousData, newDoc) => {
            let method
            let bodyRaw
            if (!newDoc && previousData) {
                method = 'PATCH'
                bodyRaw = jsonpatch.compare(previousData, data)
            } else {
                method = 'POST'
                bodyRaw = data
            }

            return fetch(`${settings.saveUrl}/${key}.json`, {
                method,
                mode: 'cors',
                headers: {
                    Authorization: `Basic ${settings.authorization}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyRaw),
            }).then(() => {
                setPreviousLists(data)
                setNewDoc(false)
            })
        }, DEBOUNCE_SAVE_TIME),
        []
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
        setPreviousLists(json)
    }

    useEffect(() => {
        load()
    }, [load])

    return (
        <DataContext.Provider
            value={{
                lists,
                addList,
                editList,
                delList,
                addQuestion,
                editQuestion,
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
