// ---- Predicates
export const isLetter = char => !char || typeof char !== 'string' || char.length > 1 ? false : /^[a-zA-Z]/.test(char) // A letter is a..zA..Z only
export const isWord = word => typeof word === 'string' && word.length >= 1 && Array.from(word).every(isLetter) // A word is a string of characters 
export const isLine = line =>
	typeof line === 'string'
	&& line.length >= 1
	&& Array.from(line).filter(char => char !== ' ').every(isWord)
	&& !/^\s+$/.test(line) // A line is multiple words

export const isValidLines = lines => (
	Array.isArray(lines)
	&& lines.length >= 1
	&& lines.every(line => isLine(line))
)

// ---- Core Functions
export const pipe = (...f) => x => f.reduce((acc, fn) => fn(acc), x) // Convienience function to help make the pipeline clear
export const mapResult = (result, logic, condition = true) => result.error === '' || condition ? ({ result: logic, error: '' }) : ({ result: [], error: result.error }) // Convienience function to simplify working with results (result -> result)
export const circularShift = line => line.length <= 1 ? line : [...line.slice(1), line[0]] // Circular shift moves the first word to the end of the line
export const allCircularShifts = line => line.split(' ').reduce((acc, _, i) => {
	const splitLine = line.split(' ')
	const shiftedLine = splitLine.slice(i).concat(splitLine.slice(0, i))
	const shiftedWord = circularShift(shiftedLine)
	return [...acc, shiftedWord.join(' ')] // remove .join(' ') to have words in a line like this: ['The', 'Quick', 'Brown', 'Fox'] instead of 'The Quick Brown Fox'
}, []) // All circular shifts for each word in a line and returns that list
export const orderedSet = (list, compareFx = (a, b) => String(a).localeCompare(String(b))) => [...new Set(list)].sort(compareFx) // Sort function

// ---- Result Returning functions (* -> result<list<string>>)
export const processInput = lines => isValidLines(lines)
	? { result: lines, error: '' }
	: { result: [], error: 'Input must be an array of lines (strings with words in them).\nError happened at processInput.' }

export const convertLines = linesResult => mapResult(
	linesResult,
	(Array.isArray(linesResult.result)
		&& linesResult.result?.map(line => orderedSet(line.split(' ')).join(' '))) || [],
	isValidLines(Array.isArray(linesResult.result) && linesResult.result?.map(word => word.split(' '))))

// All circular shifts for all lines (result<list<list<string>>> -> result<list<list<string>>>)
export const allCircularShiftsAllLines = linesResult => mapResult(
	linesResult,
	(Array.isArray(linesResult.result)
		&& linesResult.result.map(line => allCircularShifts(line))) || [],
	Array.isArray(linesResult.result) && linesResult.length > 0)

// Sort the lines (result<list<list<string>>> -> result<list<list<string>>>)
export const sortLines = linesResult => mapResult(
	linesResult,
	(Array.isArray(linesResult.result) &&
		linesResult.result.map(line => orderedSet(line))) || [],
	Array.isArray(linesResult.result) && linesResult.length > 0)

// KWIC Pipeline as per instructions
// (lines<list> -> result<list<list<string>>>)
export const KWIC = lines => pipe(
	processInput, // verifies input is correct and returns result 
	convertLines, // converts lines from strings to ordered set of words
	allCircularShiftsAllLines, // makes a list of list containing all the circular shifts for each line
	sortLines, // takes a list of lines (array of words), then converts each to a string to sort them, then converts the lines back to a list and returns a result
)(lines)