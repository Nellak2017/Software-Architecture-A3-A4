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
	// expects: list of strings (list of lines)
	// returns: list of set of strings sorted (list of lines sorted)
	const testCases = [
		{ input: [], expected: [] },
		{ input: ['a'], expected: ['a'] },
		{ input: ['a', 'a'], expected: ['a'] },
		{ input: ['b B c C', 'B c C b', 'C b B c', 'c C b B'], expected: ['b B c C', 'B c C b', 'c C b B', 'C b B c'] },
		{ input: ['z z b a', 'z z a b', 'z a B', 'z z Z Z Z'], expected: ['z a B', 'z z a b', 'z z b a', 'z z Z Z Z'] },
		{ input: ['apple', 'banana', 'apple', 'orange', 'banana'], expected: ['apple', 'banana', 'orange'] },
		{ input: ['C', 'c', 'B', 'a', 'b', 'A', 'Z', 'z'], expected: ['a', 'A', 'b', 'B', 'c', 'C', 'z', 'Z'] },
		{ input: ['F', 'C', 'B', 'a', 'b', 'A', 'Z', 'z', 'f'], expected: ['a', 'A', 'b', 'B', 'C', 'f', 'F', 'z', 'Z'] },
		{ input: ['C', 'c', 'B', 'b'], expected: ['b', 'B', 'c', 'C'] },
		{ input: ['apple', 'banana', 'orange'], expected: ['apple', 'banana', 'orange'] },
		{ input: ['orange', 'apple', 'banana'], expected: ['apple', 'banana', 'orange'] },
		{ input: ['apple', 'orange', 'apple', 'banana'], expected: ['apple', 'banana', 'orange'] },
		{ input: ['apple', 'banana', 'apple', 'orange'], expected: ['apple', 'banana', 'orange'] },
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
		const input = ['apple', 'orange', 'apple', 'banana']
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
		{ input: 'a b c', expected: ['a b c', 'b c a', 'c a b'] },
		{ input: 'a', expected: ['a'] },
		{ input: 'abac back', expected: ['abac back', 'back abac'] },
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
	// convertLines should simply do a set operation on the lines themselves
	// convertLines should also remove extraneous whitespaces on the 
	const testCases = [
		// Test cases for valid input
		{
			input: { result: ["The Quick Brown Fox", "second line"], error: '' },
			expected: { result: ["The Quick Brown Fox", "second line"], error: '' },
		},
		{
			input: { result: ['word', 'word word'], error: '' },
			expected: { result: ['word', 'word word'], error: '' },
		},
		{
			input: { result: ['another word', 'word word'], error: '' },
			expected: { result: ['another word', 'word word'], error: '' },
		},
		{
			input: { result: ["The Quick Brown Fox", "The Quick Brown Fox"], error: '' },
			expected: { result: ["The Quick Brown Fox"], error: '' },
		},
		{
			input: { result: ["The Quick Brown     Fox", "The Quick Brown     Fox"], error: '' },
			expected: { result: ["The Quick Brown Fox"], error: '' },
		}, // removes unnecessary spaces and does set operation
		{
			input: { result: ["The Quick Brown     Fox", "The Quick Brown Fox"], error: '' },
			expected: { result: ["The Quick Brown Fox"], error: '' },
		}, // removes unnecessary spaces and does set operation, if 2 strings are equivalante ignoring whitespace, they are the same
		{
			input: { result: ["The Quick Brown     Fox", '', "The Quick Brown Fox"], error: '' },
			expected: { result: ["The Quick Brown Fox"], error: '' },
		}, // also removes empty lines
		{
			input: { result: ["The Quick Brown     Fox", '   ', "The Quick Brown Fox"], error: '' },
			expected: { result: ["The Quick Brown Fox"], error: '' },
		}, // also removes empty lines, no matter how many spaces there are
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

describe('allCircularShiftsAllLines', () => {
	const testCases = [
		// Test cases for valid input
		{
			input: {
				result: [
					'word',
					'wordtwo'
				], error: ''
			},
			expected: {
				result: [
					'word',
					'wordtwo'
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
					'The Quick Brown Fox', 'Quick Brown Fox The', 'Brown Fox The Quick', 'Fox The Quick Brown',
					'second line', 'line second'
				], error: ''
			},
		},
		{
			input: {
				result: [
					'Pipes and filters',
					'Software Architecture and Design'
				], error: ''
			},
			expected: {
				result: [
					'Pipes and filters', 'and filters Pipes', 'filters Pipes and',
					'Software Architecture and Design', 'Architecture and Design Software', 'and Design Software Architecture', 'Design Software Architecture and'
				], error: ''
			},
		}, // Test case based on professor's email
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
	// takes a list of lines, removes duplicate lines, then sorts them line-by-line 
	// 	and character-by-character, and returns a result
	const testCases = [
		// Test cases for valid input
		{
			input: {
				result: [
						'The Quick Brown Fox',
						'Quick Brown Fox The',
						'Brown Fox The Quick',
						'Fox The Quick Brown',
						'second line',
						'line second',
				], error: ''
			},
			expected: {
				result: [
					'Brown Fox The Quick',
					'Fox The Quick Brown',
					'line second',
					'Quick Brown Fox The',
					'second line',
					'The Quick Brown Fox',
				], error: ''
			},
		},
		{
			input: {
				result: [
						'b B c C',
						'B c C b',
						'c C b B',
						'C b B c',
						'C b B c',
						'b B c C',
						'B c C b',
						'c C b B',
				], error: ''
			},
			expected: {
				result: [
					'b B c C',
					'B c C b',
					'c C b B',
					'C b B c',
				], error: ''
			}, // Duplicates are removed!
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
			input: ['brown fox', 'jumped over', 'the lazy'],
			expected: 'brown fox\njumped over\nthe lazy',
		},
		// Multiple lists
		{
			input: [
				'brown fox', 'jumped over', 'the lazy','hello world', 'foo bar', 'lorem ipsum',
			],
			expected: 'brown fox\njumped over\nthe lazy\nhello world\nfoo bar\nlorem ipsum',
		},
		// Empty list
		{
			input: [[]],
			expected: '',
		},
		// Based on professor's email
		{
			input: [
				"and Design Software Architecture",
				"and filters Pipes",
				"Architecture and Design Software",
				"Design Software Architecture and",
				"filters Pipes and",
				"Pipes and filters",
				"Software Architecture and Design"
			],
			expected: 'and Design Software Architecture\nand filters Pipes\nArchitecture and Design Software\nDesign Software Architecture and\nfilters Pipes and\nPipes and filters\nSoftware Architecture and Design'
		}
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
					"Brown Fox The Quick",
					"Fox The Quick Brown",
					"line second",
					"Quick Brown Fox The",
					"second line",
					"The Quick Brown Fox",
				],
				"error": ""
			},
		},
		{
			input: ['Pipes and filters', 'Software Architecture and Design'],
			expected: {
				"result": [
					"and Design Software Architecture",
					"and filters Pipes",
					"Architecture and Design Software",
					"Design Software Architecture and",
					"filters Pipes and",
					"Pipes and filters",
					"Software Architecture and Design",
				],
				"error": ""
			},
		}, // Test case based on Professor's email
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