import {
	Input,
	LineStorage,
	CircularShift,
	Alphabetizer,
	KWICv3,
} from './OO_KWIC.js'

// Define the Input class test suite
describe('Input class', () => {
	// Define the LineStorage instance
	let lineStorage

	// Initialize a new LineStorage instance before each test case
	beforeEach(() => {
		lineStorage = new LineStorage()
	})

	// Define the test cases
	const testCases = [
		// Happy path
		{
			description: "Input with one line",
			input: ["First Line"],
			expectedOutput: {
				lineStorageLines: [["First", "Line"]]
			}
		},
		{
			description: "Input with multiple lines",
			input: ["First Line", "Second Line this is"],
			expectedOutput: {
				lineStorageLines: [["First", "Line"], ["Second", "Line", "this", "is"]]
			}
		},

		// Bad path
		{
			description: "Input with one empty line",
			input: [""],
			expectedOutput: {
				lineStorageLines: [[""]]
			}
		},
		{
			description: "Input with multiple empty lines",
			input: ["", "", ""],
			expectedOutput: {
				lineStorageLines: [[""], [""], [""]]
			}
		},
		{
			description: "Input with leading and trailing whitespace",
			input: ["  First Line  ", "Second Line   "],
			expectedOutput: {
				lineStorageLines: [["First", "Line"], ["Second", "Line"]]
			}
		},
		{
			description: "Input with lines containing special characters",
			input: ["!@#$%^&*()", "()-_=+{}[]|:'\"<>,.?/"],
			expectedOutput: {
				lineStorageLines: [["!@#$%^&*()"], ["()-_=+{}[]|:'\"<>,.?/"]]
			}
		},
		{
			description: "Input with lines containing numbers",
			input: ["12345", "9876", "0"],
			expectedOutput: {
				lineStorageLines: [["12345"], ["9876"], ["0"]]
			}
		},
		{
			description: "Input with lines containing only whitespace",
			input: ["    ", "  \t  ", "\t\t"],
			expectedOutput: {
				lineStorageLines: [[""], [""], [""]]
			}
		},
	]

	// Iterate over each test case
	testCases.forEach((testCase, index) => {
		// Define the test
		it(`Test Case ${index + 1}: ${testCase.description}`, () => {
			// Create a new Input instance with the LineStorage instance
			const input = new Input(lineStorage)

			// Execute the read method with the input data
			input.read(testCase.input)

			// Verify the output by comparing the LineStorage lines with the expected output
			expect(lineStorage.lines).toEqual(testCase.expectedOutput.lineStorageLines)
		})
	})
})

describe('LineStorage', () => {
	// Define the LineStorage instance
	let lineStorage

	// Initialize a new LineStorage instance before each test case
	beforeEach(() => {
		lineStorage = new LineStorage()
	})

	// Test the setLine method
	describe('setLine method', () => {
		// Define test cases for the setLine method
		const setLineTestCases = [
			{
				description: 'should add a new line to the storage',
				lineText: 'Test',
				expectedLines: ['Test']
			},
			{
				description: 'should add a new line to the storage',
				lineText: ['Test', 'another'],
				expectedLines: [['Test', 'another']]
			},
		]

		setLineTestCases.forEach((testCase, index) => {
			it(`Test Case ${index + 1}: ${testCase.description}`, () => {
				// Arrange
				const { lineText, expectedLines } = testCase

				// Act
				lineStorage.setLine(lineText)

				// Assert
				expect(lineStorage.lines).toEqual(expectedLines)
			})
		})
	})

	// Test the setChar method
	describe('setChar method', () => {
		// Define test cases for the setChar method
		const setCharTestCases = [
			{
				description: 'should set the character at the specified position in the line',
				lines: [['Pipe', 'and', 'Filter'], ['Software', 'Architecture', 'in', 'Practice']],
				lineIndex: 0,
				wordIndex: 1,
				charIndex: 1,
				char: 'b',
				expectedLines: [['Pipe', 'abd', 'Filter'], ['Software', 'Architecture', 'in', 'Practice']]
			},
			// Add more test cases as needed
		]
		setCharTestCases.forEach((testCase, index) => {
			it(`Test Case ${index + 1}: ${testCase.description}`, () => {
				// Arrange
				const { lines, lineIndex, wordIndex, charIndex, char, expectedLines } = testCase

				// Act
				lines.forEach(line => lineStorage.setLine(line)) // ex: [firstline, secondline,...]
				lineStorage.setChar(lineIndex, wordIndex, charIndex, char)

				// Assert
				expect(lineStorage.lines).toEqual(expectedLines)
			})
		})
	})

	// Test the getChar method
	describe('getChar method', () => {
		// Define test cases for the getChar method
		const getCharTestCases = [
			{
				description: 'should return the character at the specified position in the line',
				lines: [['Pipe', 'and', 'Filter'], ['Software', 'Architecture', 'in', 'Practice']],
				lineIndex: 0,
				wordIndex: 1,
				charIndex: 1,
				expectedChar: 'n'
			},
			// Add more test cases as needed
		]

		getCharTestCases.forEach((testCase, index) => {
			it(`Test Case ${index + 1}: ${testCase.description}`, () => {
				// Arrange
				const { lines, lineIndex, wordIndex, charIndex, expectedChar } = testCase

				// Act
				lines.forEach(line => lineStorage.setLine(line)) // ex: [firstline, secondline,...]
				const result = lineStorage.getChar(lineIndex, wordIndex, charIndex)

				// Assert
				expect(result).toBe(expectedChar)
			})
		})
	})

	// Test the wordCount method
	describe('wordCount method', () => {
		// Define test cases for the wordCount method
		const wordCountTestCases = [
			{
				description: 'should return the number of words in the specified line',
				lines: [['Pipe', 'and', 'Filter'], ['Software', 'Architecture', 'in', 'Practice']],
				lineIndex: 0,
				expectedWordCount: 3
			},
			// Add more test cases as needed
		]

		wordCountTestCases.forEach((testCase, index) => {
			it(`Test Case ${index + 1}: ${testCase.description}`, () => {
				// Arrange
				const { lines, lineIndex, expectedWordCount } = testCase

				// Act
				lines.forEach(line => lineStorage.setLine(line)) // ex: [firstline, secondline,...]
				const result = lineStorage.wordCount(lineIndex)

				// Assert
				expect(result).toBe(expectedWordCount)
			})
		})
	})

})

describe('CircularShift', () => {
	// Test the setup method
	describe('setup method', () => {
		// Define test cases for the setup method
		const setupTestCases = [
			{
				description: 'should generate correct circular shifts for each line',
				lines: [['Pipe', 'and', 'Filter'], ['Software', 'Architecture', 'in', 'Practice']],
				expectedShifts: [
					['Pipe', 'and', 'Filter'], ['and', 'Filter', 'Pipe'], ['Filter', 'Pipe', 'and'],

					['Software', 'Architecture', 'in', 'Practice'], ['Architecture', 'in', 'Practice', 'Software'],
					['in', 'Practice', 'Software', 'Architecture'], ['Practice', 'Software', 'Architecture', 'in']
				]
			},
		]

		setupTestCases.forEach((testCase, index) => {
			it(`Test Case ${index + 1}: ${testCase.description}`, () => {
				// Arrange
				const { lines, expectedShifts } = testCase

				const lineStorage = new LineStorage(lines)
				const circularShift = new CircularShift(lineStorage)

				// Act: CircularShift setup has already been called in beforeEach
				circularShift.setup()

				// Assert
				expect(circularShift.shifts).toEqual(expectedShifts)
			})
		})
	})

	// Test the setChar method
	describe('setChar method', () => {
		// Define test cases for the setChar method
		const setCharTestCases = [
			{
				description: 'should set the character at the specified position in the circular shift',
				lines: [['Pipe', 'and', 'Filter'], ['Software', 'Architecture', 'in', 'Practice']],
				shiftIndex: 0,
				wordIndex: 1,
				charIndex: 1,
				char: 'b',
				expectedModifiedShifts: [
					['Pipe', 'abd', 'Filter'], ['and', 'Filter', 'Pipe'], ['Filter', 'Pipe', 'and'],
					['Software', 'Architecture', 'in', 'Practice'], ['Architecture', 'in', 'Practice', 'Software'],
					['in', 'Practice', 'Software', 'Architecture'], ['Practice', 'Software', 'Architecture', 'in']
				]
			},
			// Add more test cases as needed
		]

		setCharTestCases.forEach((testCase, index) => {
			it(`Test Case ${index + 1}: ${testCase.description}`, () => {
				// Arrange
				const { lines, shiftIndex, wordIndex, charIndex, char, expectedModifiedShifts } = testCase
				const lineStorage = new LineStorage(lines)
				const circularShift = new CircularShift(lineStorage)
				circularShift.setup()

				// Act
				circularShift.setChar(shiftIndex, wordIndex, charIndex, char)

				// Assert
				expect(circularShift.shifts).toEqual(expectedModifiedShifts)
			})
		})
	})

	// Test the getChar method
	describe('getChar method', () => {
		// Define test cases for the getChar method
		const getCharTestCases = [
			{
				description: 'should return the character at the specified position in the circular shift',
				lines: [['Pipe', 'and', 'Filter'], ['Software', 'Architecture', 'in', 'Practice']],
				shiftIndex: 0,
				wordIndex: 1,
				charIndex: 1,
				expectedChar: 'n'
			},
			// Add more test cases as needed
		]

		getCharTestCases.forEach((testCase, index) => {
			it(`Test Case ${index + 1}: ${testCase.description}`, () => {
				// Arrange
				const { lines, shiftIndex, wordIndex, charIndex, expectedChar } = testCase
				const lineStorage = new LineStorage(lines)
				const circularShift = new CircularShift(lineStorage)
				circularShift.setup()

				// Act
				const result = circularShift.getChar(shiftIndex, wordIndex, charIndex)

				// Assert
				expect(result).toBe(expectedChar)
			})
		})
	})

	// Test the wordCount method
	describe('wordCount method', () => {
		// Define test cases for the wordCount method
		const wordCountTestCases = [
			{
				description: 'should return the number of words in the specified circular shift',
				lines: [['Pipe', 'and', 'Filter'], ['Software', 'Architecture', 'in', 'Practice']],
				shiftIndex: 0,
				expectedWordCount: 3
			},
			// Add more test cases as needed
		]

		wordCountTestCases.forEach((testCase, index) => {
			it(`Test Case ${index + 1}: ${testCase.description}`, () => {
				// Arrange
				const { lines, shiftIndex, expectedWordCount } = testCase
				const lineStorage = new LineStorage(lines)
				const circularShift = new CircularShift(lineStorage)
				circularShift.setup()

				// Act
				const result = circularShift.wordCount(shiftIndex)

				// Assert
				expect(result).toBe(expectedWordCount)
			})
		})
	})

})

describe('Alphabetizer', () => {
	// Test the alph method
	describe('alph method', () => {
		// Define test cases for the alph method
		const alphTestCases = [
			{
				description: 'should alphabetize circular shifts correctly',
				lines: [
					['Pipe', 'and', 'Filter'],
					['and', 'Filter', 'Pipe'],
					['Filter', 'Pipe', 'and'],
					['Software', 'Architecture', 'in', 'Practice'],
					['Architecture', 'in', 'Practice', 'Software'],
					['in', 'Practice', 'Software', 'Architecture'],
					['Practice', 'Software', 'Architecture', 'in']
				],
				expectedAlphabetizedLines: [
					['and', 'Filter', 'Pipe'],
					['Architecture', 'in', 'Practice', 'Software'],
					['Filter', 'Pipe', 'and'],
					['in', 'Practice', 'Software', 'Architecture'],
					['Pipe', 'and', 'Filter'],
					['Practice', 'Software', 'Architecture', 'in'],
					['Software', 'Architecture', 'in', 'Practice']
				]
			},
			{
				description: 'should alphabetize circular shifts correctly for standard simple input',
				lines: [
					['Z'],
					['z'],
					['Y'],
					['y'],
					['c'],
					['C'],
				],
				expectedAlphabetizedLines: [
					['c'],
					['C'],
					['y'],
					['Y'],
					['z'],
					['Z'],
				]
			}
		]

		alphTestCases.forEach((testCase, index) => {
			it(`Test Case ${index + 1}: ${testCase.description}`, () => {
				// Arrange
				const { lines, expectedAlphabetizedLines } = testCase
				const alphabetizer = new Alphabetizer(lines)

				// Act: Call the alph method
				alphabetizer.alph()

				// Assert: Check if the alphabetized lines match the expected result
				expect(alphabetizer.alphabetizedLines).toEqual(expectedAlphabetizedLines)
			})
		})
	})

})

describe('KWICV3', () => {
	const testCases = [
		// Test cases for valid input
		{
			input: ['The Quick Brown Fox', 'second line'],
			expected: [
				"Brown Fox The Quick",
				"Fox The Quick Brown",
				"line second",
				"Quick Brown Fox The",
				"second line",
			],
		},
		{
			input: ['Pipes and filters', 'Software Architecture and Design'],
			expected: [
				"Architecture and Design Software",
				"Design Software Architecture and",
				"filters Pipes and",
				"Pipes and filters",
				"Software Architecture and Design",
			]
		}, // Test case based on Professor's email
	]
	testCases.forEach(testCase => {
		it(`should return ${JSON.stringify(testCase.expected)} for input '${JSON.stringify(testCase.input)}'`, () => {
			const input = testCase.input
			const result = KWICv3(input)
			expect(result).toEqual(testCase.expected)
		})
	})
})