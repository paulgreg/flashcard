import { replaceSpecialCharBySpace } from './string'

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
})
