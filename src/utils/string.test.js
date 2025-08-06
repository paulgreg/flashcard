import { replaceSpecialCharBySpace, slugify } from './string'

describe('string', () => {
    describe('replaceSpecialCharBySpace', () => {
        test('should replace special char', () => {
            expect(replaceSpecialCharBySpace("d'a")).toEqual('d a')
            expect(replaceSpecialCharBySpace('d`a')).toEqual('d a')
            expect(replaceSpecialCharBySpace('d"a')).toEqual('d a')
            expect(replaceSpecialCharBySpace('(parenthesis)')).toEqual(
                ' parenthesis '
            )
            expect(replaceSpecialCharBySpace('[bracket]')).toEqual(' bracket ')
        })
    })

    describe('slugify', () => {
        test('should remove space', () => expect(slugify('a a')).toEqual('a-a'))
        test('should trim space', () => expect(slugify('  a  ')).toEqual('a'))

        test('should keep accent', () => expect(slugify('àé')).toEqual('àé'))

        test('should keep uppercase', () =>
            expect(slugify('Test')).toEqual('Test'))
    })
})
