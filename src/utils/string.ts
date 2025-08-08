import { PREFIX } from './constants'

export const removeAccent = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const replaceSpecialCharBySpace = (str: string) =>
    str.replace(/[-_'`"()[\]]/g, ' ')

export const cleanStr = (str: string) =>
    replaceSpecialCharBySpace(removeAccent(str.toLocaleLowerCase()))

export const slugify = (s: string) =>
    replaceSpecialCharBySpace(s).trim().replace(/\s+/g, '-') // Replace spaces with dashes

export const formatRawListName = (rawDocName = '') =>
    decodeURIComponent(rawDocName.split(`${PREFIX}:`)[1])
