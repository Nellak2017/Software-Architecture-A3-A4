import {
	orderedSet,
	isLetter,
	isWord,
	isLine,
	circularShift,
	allCircularShifts,
	processInput,
	convertLines,
	allCircularShiftsAllLines,
	sortLines,
	display,
	KWIC,
} from './helpers.js'

describe('orderedSet', () => {
	const testCases = [
		{ input: [], expected: [] },
		{ input: ['a'], expected: ['a'] },
		{ input: ['a', 'a'], expected: ['a'] },
		{ input: ['b B c C', 'B c C b', 'C b B c', 'c C b B'], expected: ['b B c C', 'B c C b', 'c C b B', 'C b B c']}, 
		{ input: ['apple', 'banana', 'apple', 'orange', 'banana'], expected: ['apple', 'banana', 'orange'] },
		{ input: ['C', 'c', 'B', 'a', 'b', 'A', 'Z', 'z'], expected: ['a', 'A', 'b', 'B', 'c', 'C', 'z', 'Z'] },
		{ input: ['F', 'C', 'B', 'a', 'b', 'A', 'Z', 'z', 'f'], expected: ['a', 'A', 'b', 'B', 'C', 'f', 'F', 'z', 'Z'] },
		{ input: ['C', 'c', 'B', 'b'], expected: ['b', 'B', 'c', 'C'] },
		{ input: [['apple', 'banana'], ['orange']], expected: [['apple', 'banana'], ['orange']] },
		{ input: [['orange'], ['apple', 'banana']], expected: [['apple', 'banana'], ['orange']] },
		{ input: [['apple', 'orange'], ['apple', 'banana']], expected: [['apple', 'banana'], ['apple', 'orange']] },
		{ input: [['apple', 'banana'], ['apple', 'orange']], expected: [['apple', 'banana'], ['apple', 'orange']] },
		{ input: ['zello world', 'bext line', 'line 3'], expected: ['bext line', 'line 3', 'zello world'] },
	]
	testCases.forEach(testCase => {
		it(`should return ${testCase.expected} for input '${testCase.input}'`, () => {
			const input = testCase.input
			const result = orderedSet(input)
			expect(result).toEqual(testCase.expected)
		})
	})

	// verify that input is not changed
	it('should not change the input', () => {
		const input = [1, 2, 3, 4, 4, 3, 2, 1]
		const inputCopy = [...input]
		orderedSet(input)
		// Verify that the input array is unchanged by reference
		expect(input).toEqual(inputCopy)
	})
})

describe('isLetter', () => {
	const testCases = [
		{ input: '', expected: false },
		{ input: '1', expected: false },
		{ input: 1, expected: false },
		{ input: {}, expected: false },
		{ input: [], expected: false },
		{ input: { letter: 'a' }, expected: false },
		{ input: ['a'], expected: false },
		{ input: ['a', 'b'], expected: false },
		{ input: 1e100, expected: false },
		{ input: '100', expected: false },
		{ input: 'zz', expected: false }, // longer than len 1
		{ input: 'aa', expected: false }, // longer than len 1
		{ input: null, expected: false },
		{ input: undefined, expected: false },
		{ input: NaN, expected: false },

		{ input: 'a', expected: true },
		{ input: 'b', expected: true },
		{ input: 'k', expected: true },
		{ input: 'z', expected: true },
		{ input: 'A', expected: true },
		{ input: 'B', expected: true },
		{ input: 'K', expected: true },
		{ input: 'Z', expected: true },
	]
	testCases.forEach(testCase => {
		it(`should return ${testCase.expected} for input '${testCase.input}'`, () => {
			const input = testCase.input
			const result = isLetter(input)
			expect(result).toBe(testCase.expected)
		})
	})
})

describe('isWord', () => {
	const testCases = [
		{ input: '', expected: false },
		{ input: '1', expected: false },
		{ input: ['1'], expected: false },
		{ input: 1, expected: false },
		{ input: {}, expected: false },
		{ input: [], expected: false },
		{ input: { letter: 'a' }, expected: false },
		{ input: ['a1'], expected: false },
		{ input: ['a', 'b', 1], expected: false },
		{ input: 1e100, expected: false },
		{ input: ['100'], expected: false },
		{ input: ['zz'], expected: false }, // longer than len 1
		{ input: ['aa', 'zzz'], expected: false }, // longer than len 1
		{ input: null, expected: false },
		{ input: undefined, expected: false },
		{ input: NaN, expected: false },

		{ input: 'ab', expected: true },
		{ input: 'kzA', expected: true },
		{ input: 'B', expected: true },
		{ input: 'KKK', expected: true },
		{ input: 'Zapdoss', expected: true },
	]
	testCases.forEach(testCase => {
		it(`should return ${testCase.expected} for input '${testCase.input}'`, () => {
			const input = testCase.input
			const result = isWord(input)
			expect(result).toBe(testCase.expected)
		})
	})
})

describe('isLine', () => {
	const testCases = [
		{ input: '', expected: false },
		{ input: ' ', expected: false },
		{ input: '1', expected: false },
		{ input: ['1'], expected: false },
		{ input: 1, expected: false },
		{ input: {}, expected: false },
		{ input: [], expected: false },
		{ input: { letter: 'a' }, expected: false },
		{ input: ['a1'], expected: false },
		{ input: ['a', 'b', 1], expected: false },
		{ input: 1e100, expected: false },
		{ input: [['100']], expected: false },
		{ input: [['zz']], expected: false }, // longer than len 1
		{ input: [['aa', 'zzz']], expected: false }, // longer than len 1
		{ input: [['a', 'b', 1]], expected: false },
		{ input: [['a', 'b'], ['k', 'z', 'A', null]], expected: false },
		{ input: [['B'], null], expected: false },
		{ input: [['K', 'K', 'K', undefined], ['a', 'b'], ['a', 'b']], expected: false },
		{ input: [['Zapdoss'], ['a'], [], ['a', 'b'], ['a', 'b']], expected: false },
		{ input: null, expected: false },
		{ input: undefined, expected: false },
		{ input: NaN, expected: false },

		{ input: 'ab', expected: true },
		{ input: 'ab kz A', expected: true },
		{ input: 'B', expected: true },
		{ input: 'KKK ab ab', expected: true },
		{ input: 'Zapdos is a legendary pokemon', expected: true },
	]
	testCases.forEach(testCase => {
		it(`should return ${testCase.expected} for input '${testCase.input}'`, () => {
			const input = testCase.input
			const result = isLine(input)
			expect(result).toBe(testCase.expected)
		})
	})
})

describe('circularShift', () => {
	const testCases = [
		{ input: ['a', 'b', 'c'], expected: ['b', 'c', 'a'] },
		{ input: ['a'], expected: ['a'] },
		{ input: ['abac', 'back'], expected: ['back', 'abac'] },
		{ input: [], expected: [] },
	]
	testCases.forEach(testCase => {
		it(`should return ${testCase.expected} for input '${testCase.input}'`, () => {
			const input = testCase.input
			const result = circularShift(input)
			expect(result).toEqual(testCase.expected)
		})
	})
})

describe('allCircularShifts', () => {
	const testCases = [
		{ input: 'a b c', expected: ['b c a', 'c a b', 'a b c'] },
		{ input: 'a', expected: ['a'] },
		{ input: 'abac back', expected: ['back abac', 'abac back'] },
		{ input: '', expected: [''] },
	]
	testCases.forEach(testCase => {
		it(`should return ${testCase.expected} for input '${testCase.input}'`, () => {
			const input = testCase.input
			const result = allCircularShifts(input)
			expect(result).toEqual(testCase.expected)
		})
	})
})

describe('processInput', () => {
	const errorExpected = { result: [], error: 'Input must be an array of lines (strings with words in them).\nError happened at processInput.' }
	const testCases = [
		{ input: ['The Quick Brown Fox', 'second line'], expected: { result: ['The Quick Brown Fox', 'second line'], error: '' } },
		{ input: 'not an array', expected: errorExpected },
		{ input: [['word1', 'word2'], 'not a line'], expected: errorExpected },
		{ input: [], expected: errorExpected },
	]
	testCases.forEach(testCase => {
		it(`should return ${JSON.stringify(testCase.expected)} for input '${JSON.stringify(testCase.input)}'`, () => {
			const input = testCase.input
			const result = processInput(input)
			expect(result).toEqual(testCase.expected)
		})
	})
})

describe('convertLines', () => {
	const testCases = [
		// Test cases for valid input
		{
			input: { result: ["The Quick Brown Fox", "second line"], error: '' },
			expected: { result: ['Brown Fox Quick The', 'line second'], error: '' },
		},
		{
			input: { result: ['word', 'word word'], error: '' },
			expected: { result: ['word', 'word'], error: '' },
		},
		{
			input: { result: ['another word', 'word word'], error: '' },
			expected: { result: ['another word', 'word'], error: '' },
		},
		// Test cases for invalid input removed because input is guaranteed to be safe due to pipe
	]
	testCases.forEach(testCase => {
		it(`should return ${JSON.stringify(testCase.expected)} for input '${JSON.stringify(testCase.input)}'`, () => {
			const input = testCase.input
			const result = convertLines(input)
			expect(result).toEqual(testCase.expected)
		})
	})
})
/*
describe('convertWords', () => {
	const testCases = [
		// Test cases for valid input
		{
			input: { result: [['word'], ['word']], error: '' },
			expected: { result: [['word'], ['word']], error: '' },
		},
		{
			input: { result: ['word', 'word word'], error: '' },
			expected: { result: [['word'], ['word']], error: '' },
		},
		{
			input: { result: ['another word', 'word word'], error: '' },
			expected: { result: [['another','word'], ['word']], error: '' },
		},
		// Test cases for invalid input
		{
			input: { result: [], error: 'Invalid input' },
			expected: { result: [], error: 'Invalid input' },
		},
		{
			input: { result: 'not an array', error: 'Invalid input' },
			expected: { result: [], error: 'Invalid input' },
		},
	]
})
*/

describe('allCircularShiftsAllLines', () => {
	const testCases = [
		// Test cases for valid input
		{
			input: {
				result: [
					'word',
					'word'
				], error: ''
			},
			expected: {
				result: [
					['word'],
					['word']
				], error: ''
			},
		},
		{
			input: {
				result: [
					'The Quick Brown Fox',
					'second line'
				], error: ''
			},
			expected: {
				result: [
					['Quick Brown Fox The', 'Brown Fox The Quick', 'Fox The Quick Brown', 'The Quick Brown Fox'],
					['line second', 'second line']
				], error: ''
			},
		},
		// Test cases for invalid input removed because input guaranteed to be valid in pipe
	]
	testCases.forEach(testCase => {
		it(`should return ${JSON.stringify(testCase.expected)} for input '${JSON.stringify(testCase.input)}'`, () => {
			const input = testCase.input
			const result = allCircularShiftsAllLines(input)
			expect(result).toEqual(testCase.expected)
		})
	})
})

describe('sortLines', () => {
	const testCases = [
		// Test cases for valid input
		{
			input: { result: [['Quick Brown Fox The', 'Brown Fox The Quick', 'Fox The Quick Brown', 'The Quick Brown Fox'], ['line second', 'second line']], error: '' },
			expected: { result: [['Brown Fox The Quick', 'Fox The Quick Brown', 'Quick Brown Fox The', 'The Quick Brown Fox'], ['line second', 'second line']], error: '' },
			description: 'Valid input: array of lines with words',
		},
		{
			input: { result: [['b', 'B', 'c', 'C'], ['B', 'c', 'C', 'b'], ['C', 'b', 'B', 'c'], ['c', 'C', 'b', 'B']], error: '' },
			expected: { result: [['b', 'B', 'c', 'C'], ['b', 'B', 'c', 'C'], ['b', 'B', 'c', 'C'], ['b', 'B', 'c', 'C']], error: '' }, // not sure if this is right
			description: 'Valid input: array of lines with words',
		},
		// Test cases for invalid input removed because input guaranteed to be valid in pipe
	]
	testCases.forEach(testCase => {
		it(`should return ${JSON.stringify(testCase.expected)} for input '${JSON.stringify(testCase.input)}'`, () => {
			const input = testCase.input
			const result = sortLines(input)
			expect(result).toEqual(testCase.expected)
		})
	})
})

describe('display', () => {
	const testCases = [
		// Single list
		{
			input: [['brown fox', 'jumped over', 'the lazy']],
			expected: 'brown fox\njumped over\nthe lazy',
		},
		// Multiple lists
		{
			input: [
				['brown fox', 'jumped over', 'the lazy'],
				['hello world', 'foo bar', 'lorem ipsum'],
			],
			expected: 'brown fox\njumped over\nthe lazy\n\nhello world\nfoo bar\nlorem ipsum',
		},
		// Empty list
		{
			input: [[]],
			expected: '',
		},
	]
	testCases.forEach(testCase => {
		it(`should return ${JSON.stringify(testCase.expected)} for input '${JSON.stringify(testCase.input)}'`, () => {
			const input = testCase.input
			const result = display(input)
			expect(result).toEqual(testCase.expected)
		})
	})
})

describe('KWIC', () => {
	const testCases = [
		// Test cases for valid input
		{
			input: ['The Quick Brown Fox', 'second line'],
			expected: {
				"result": [
					[
						"Brown Fox Quick The",
						"Fox Quick The Brown",
						"Quick The Brown Fox",
						"The Brown Fox Quick"
					],
					[
						"line second",
						"second line"
					]
				],
				"error": ""
			},
		},
		// Test cases for invalid input removed because input guaranteed to be valid in pipe
	]
	testCases.forEach(testCase => {
		it(`should return ${JSON.stringify(testCase.expected)} for input '${JSON.stringify(testCase.input)}'`, () => {
			const input = testCase.input
			const result = KWIC(input)
			expect(result).toEqual(testCase.expected)
		})
	})
})