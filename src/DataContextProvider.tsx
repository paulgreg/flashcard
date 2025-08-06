import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
    FlashcardLists,
    FlashcardPartialQuestion,
    FlashcardQuestion,
    FlashcardQuestions,
    YFlashcardList,
    YFlashcardQuestion,
} from './Types'
import settings from './settings.json'
import { getId } from './utils'
import { DataContext } from './DataContext'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebsocketProvider } from 'y-websocket'
import { useY } from 'react-yjs'
import { PREFIX } from './utils/constants'

interface DataContextProviderPropsType {
    name: string
    children: React.ReactNode | React.ReactNode[]
}

const DataContextProvider: React.FC<DataContextProviderPropsType> = ({
    name,
    children,
}) => {
    const guid = `${PREFIX}:${name}`

    const yDoc = useMemo(() => new Y.Doc({ guid }), [guid])
    const yLists = yDoc.getArray<Y.Map<YFlashcardList>>(`lists`)

    const persistence = useRef<IndexeddbPersistence>(null)
    const provider = useRef<WebsocketProvider>(null)

    useEffect(() => {
        persistence.current = new IndexeddbPersistence(guid, yDoc)
        if (settings.saveOnline && settings.crdtUrl) {
            provider.current = new WebsocketProvider(
                settings.crdtUrl,
                guid,
                yDoc,
                {
                    params: { secret: settings.secret },
                }
            )
            return () => provider.current?.disconnect()
        }
    }, [guid, yDoc])

    const addList = useCallback(
        (name: string, questions: FlashcardQuestions = []) => {
            yDoc.transact(() => {
                const yList = new Y.Map<YFlashcardList>()
                yList.set('id', getId())
                yList.set('name', name)
                const yQuestions = new Y.Array<Y.Map<YFlashcardQuestion>>()
                if (questions?.length >= 0) {
                    yQuestions.push(
                        questions.map(({ id, q, a, score, count }) => {
                            const yQuestion = new Y.Map<YFlashcardQuestion>()
                            yQuestion.set('id', id)
                            yQuestion.set('q', q)
                            yQuestion.set('a', a)
                            if (score) yQuestion.set('score', score)
                            if (count) yQuestion.set('count', count)
                            return yQuestion
                        })
                    )
                }
                yList.set('questions', yQuestions)
                yLists.insert(0, [yList])
            })
        },
        [yDoc, yLists]
    )

    const editList = useCallback(
        (id: string, name: string) => {
            const idx = yLists
                .toArray()
                .findIndex((list) => list.get('id') === id)
            if (idx >= 0) {
                yLists.get(idx).set('name', name)
            }
        },
        [yLists]
    )

    const addQuestion = useCallback(
        (listId: string) => (question: FlashcardPartialQuestion) => {
            const { q, a } = question
            const idx = yLists
                .toArray()
                .findIndex((list) => list.get('id') === listId)
            if (idx >= 0) {
                const yQuestions = yLists
                    .get(idx)
                    .get('questions') as unknown as Y.Array<
                    Y.Map<YFlashcardQuestion>
                >
                if (yQuestions) {
                    const yQuestion = new Y.Map<YFlashcardQuestion>()
                    yQuestion.set('id', getId())
                    yQuestion.set('q', q)
                    yQuestion.set('a', a)
                    yQuestions?.insert(0, [yQuestion])
                }
            }
        },
        [yLists]
    )
    const editQuestion = useCallback(
        (listId: string) => (question: FlashcardQuestion) => {
            const { id: questionId, q, a } = question
            const idx = yLists
                .toArray()
                .findIndex((list) => list.get('id') === listId)
            if (idx >= 0) {
                const yQuestions = yLists
                    .get(idx)
                    .get('questions') as unknown as Y.Array<
                    Y.Map<YFlashcardQuestion>
                >
                const qIdx = yQuestions
                    .toArray()
                    .findIndex((question) => question.get('id') === questionId)
                if (qIdx >= 0) {
                    yDoc.transact(() => {
                        const yQuestion = yQuestions.get(qIdx)
                        yQuestion.set('q', q)
                        yQuestion.set('a', a)
                    })
                }
            }
        },
        [yDoc, yLists]
    )

    const delList = useCallback(
        (listId: string) => {
            const idx = yLists
                .toArray()
                .findIndex((list) => list.get('id') === listId)
            if (idx >= 0) {
                yLists.delete(idx, 1)
            }
        },
        [yLists]
    )

    const setScore = useCallback(
        (listId: string, questionId: string, score: number) => {
            const idx = yLists
                .toArray()
                .findIndex((list) => list.get('id') === listId)
            if (idx >= 0) {
                const yQuestions = yLists
                    .get(idx)
                    .get('questions') as unknown as Y.Array<
                    Y.Map<YFlashcardQuestion>
                >
                const qIdx = yQuestions
                    .toArray()
                    .findIndex((question) => question.get('id') === questionId)
                if (qIdx >= 0) {
                    yDoc.transact(() => {
                        const yQuestion = yQuestions.get(qIdx)
                        const previousScore =
                            (yQuestion.get('score') as number) ?? 0
                        const previousCount =
                            (yQuestion.get('count') as number) ?? 0
                        yQuestion.set('score', previousScore + score)
                        yQuestion.set('count', previousCount + 1)
                    })
                }
            }
        },
        [yDoc, yLists]
    )

    const delQuestion = useCallback(
        (listId: string, questionId: string) => {
            const idx = yLists
                .toArray()
                .findIndex((list) => list.get('id') === listId)
            if (idx >= 0) {
                const yQuestions = yLists
                    .get(idx)
                    .get('questions') as unknown as Y.Array<
                    Y.Map<YFlashcardQuestion>
                >
                const qIdx = yQuestions
                    .toArray()
                    .findIndex((question) => question.get('id') === questionId)
                if (qIdx >= 0) {
                    yQuestions.delete(qIdx, 1)
                }
            }
        },
        [yLists]
    )

    const lists = useY(yLists) as unknown as FlashcardLists

    const sortedLists = useMemo(
        () => lists.toSorted((l1, l2) => l1.name.localeCompare(l2.name)),
        [lists]
    )

    const contextValue = useMemo(
        () => ({
            lists: sortedLists,
            addList,
            editList,
            delList,
            addQuestion,
            editQuestion,
            delQuestion,
            setScore,
        }),
        [
            sortedLists,
            addList,
            editList,
            delList,
            addQuestion,
            editQuestion,
            delQuestion,
            setScore,
        ]
    )

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContextProvider
