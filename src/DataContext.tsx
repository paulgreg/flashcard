import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import {
    FlashcardLists,
    FlashcardPartialQuestion,
    FlashcardQuestion,
    FlashcardQuestions,
} from './Types'
import settings from './settings.json'
import { getId } from './utils'
import * as jsonpatch from 'fast-json-patch'

type DataContextType = {
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
    key: string | null
    load: () => void
    initLoad: (key: string) => void
}

const DataContext = createContext<DataContextType>({} as DataContextType)

export const useDataContext = () => useContext(DataContext)

interface DataContextProviderPropsType {
    children: React.ReactNode | React.ReactNode[]
}

const DataContextProvider: React.FC<DataContextProviderPropsType> = ({
    children,
}) => {
    const [lists, setLists] = useState<FlashcardLists>([])
    const [previousLists, setPreviousLists] = useState<FlashcardLists>([])
    const [newDoc, setNewDoc] = useState(true)
    const [key, setKey] = useState<string | null>(
        localStorage.getItem('flashcard-key')
    )

    const addList = useCallback(
        (name: string, questions: FlashcardQuestions = []) => {
            const newData = [{ id: getId(), name, questions }].concat(lists)
            setLists(newData)
            save(newData, previousLists, newDoc)
        },
        [lists, previousLists, newDoc]
    )

    const editList = useCallback(
        (id: string, name: string) => {
            const newData = lists.map((list) =>
                list.id === id ? { ...list, name } : list
            )
            setLists(newData)
            save(newData, previousLists, newDoc)
        },
        [lists, previousLists, newDoc]
    )

    const addQuestion = useCallback(
        (listId: string) => (question: FlashcardPartialQuestion) => {
            const { q, a } = question
            const newData = lists.map((list) =>
                listId === list.id
                    ? {
                          ...list,
                          questions: [
                              {
                                  id: getId(),
                                  q,
                                  a,
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
        (listId: string) => (question: FlashcardQuestion) => {
            const { id: questionId, q, a } = question
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
        (listId: string) => {
            const newData = lists.filter((list) => list.id !== listId)
            setLists(newData)
            save(newData, previousLists, newDoc)
        },
        [lists, previousLists, newDoc]
    )

    const setScore = useCallback(
        (listId: string, questionId: string, score: number) => {
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
        (listId: string, questionId: string) => {
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
        async (key: string) =>
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

    const save = (
        newData: FlashcardLists,
        previousData: FlashcardLists,
        newDoc: boolean
    ) => {
        localStorage.setItem('flashcard', JSON.stringify(newData))
        if (settings.saveOnline) {
            const key = localStorage.getItem('flashcard-key')
            if (key) saveOnline(key, newData, previousData, newDoc)
        }
    }

    const saveOnline = useCallback(
        (
            key: string,
            data: FlashcardLists,
            previousData: FlashcardLists,
            newDoc: boolean
        ) => {
            let method
            let bodyRaw
            if (!newDoc && previousData) {
                method = 'PATCH'
                bodyRaw = jsonpatch.compare(previousData, data)
            } else {
                method = 'POST'
                bodyRaw = data
            }

            setPreviousLists(data)
            setNewDoc(false)

            return fetch(`${settings.saveUrl}/${key}.json`, {
                method,
                mode: 'cors',
                headers: {
                    Authorization: `Basic ${settings.authorization}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyRaw),
            })
        },
        []
    )

    const initLoad = async (key: string) => {
        setKey(key)
        localStorage.setItem('flashcard-key', key)
        const json = await loadOnline(key)
        setLists(json)
        setPreviousLists(json)
    }

    const contextValue = useMemo(
        () => ({
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
            load,
        }),
        [
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
            load,
        ]
    )

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContextProvider
