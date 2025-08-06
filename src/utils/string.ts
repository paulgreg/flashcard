export const removeAccent = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const replaceSpecialCharBySpace = (str: string) =>
    str.replace(/[-_'`"()[\]]/g, ' ')

export const cleanStr = (str: string) =>
    replaceSpecialCharBySpace(removeAccent(str.toLocaleLowerCase()))

export const slugify = (s: string) =>
    replaceSpecialCharBySpace(s).trim().replace(/\s+/g, '-') // Replace spaces with dashes
