import { 
	isValidLinesMicrominer, 
	allCircularShiftsAllLinesMicrominer,
} from "./microminer_helpers"

// ---- Constants
// hash table for maximum efficiency in looking it up
export const NOISE_WORDS = { "a": true, "an": true, "the": true, "and": true, "or": true, "of": true, "to": true, "be": true, "is": true, "in": true, "out": true, "by": true, "as": true, "at": true, "off": true }

// ---- Predicates
export const isLetter = char => !char || typeof char !== 'string' || char.length > 1 ? false : /^[a-zA-Z]/.test(char) // A letter is a..zA..Z only
export const isWord = word => typeof word === 'string' && word.length >= 1 && Array.from(word).every(isLetter) // A word is a string of characters 
export const isLine = line =>
	typeof line === 'string'
	&& line.length >= 1
	&& Array.from(line).filter(char => char !== ' ').every(isWord)
	&& !/^\s+$/.test(line) // A line is multiple words
export const isValidLines = (lines) => Array.isArray(lines) && lines.length >= 1 && lines.every(line => isLine(line)) // A lines is multiple lines

// ---- Core Functions
export const pipe = (...f) => x => f.reduce((acc, fn) => fn(acc), x) // Convienience function to help make the pipeline clear
export const mapResult = (result, logic, condition = true) => result.error === '' || condition ? ({ result: logic, error: '' }) : ({ result: [], error: result.error }) // Convienience function to simplify working with results (result -> result)
export const customSort = (a, b) => {
	const charPairs = [...Array.from({ length: Math.min(a.length, b.length) }, (_, i) => [a[i], b[i]])]
	const index = charPairs.findIndex(([charA, charB]) => charA !== charB)
	return index !== -1
		? charPairs[index][0].localeCompare(charPairs[index][1])
		: a.length - b.length
}
export const circularShift = line => line.length <= 1 ? line : [...line.slice(1), line[0]] // Circular shift moves the first word to the end of the line
export const allCircularShifts = line => {
	const splitLine = line.split(' ')
	return splitLine
		.reduce((acc, _, i) => i === splitLine.length - 1
			? acc
			: [...acc, circularShift([...splitLine.slice(i), ...splitLine.slice(0, i)]).join(' ')]
			, [line]) // this ternary is done so we can get the correct order with 0th first
} // All circular shifts for each word in a line and returns that list
export const orderedSet = (lines, compareFx = customSort) => [...new Set(lines)].sort(compareFx) // Sort function

// ---- Result Returning functions (* -> result<list<string>>). (Note: Only source of pipe has input validation!)
export const processInput = (predicate = isValidLines) => lines => predicate(lines) //isValidLines(lines)
	? { result: lines, error: '' }
	: { result: [], error: 'Input must be an array of lines (strings with words in them).\nError happened at processInput.' }
export const convertLines = linesResult => mapResult(linesResult, [...new Set(linesResult.result.map(line => line.replace(/\s+/g, ' ')))].filter(line => line.trim() !== ''))
export const allCircularShiftsAllLines = linesResult => mapResult(linesResult, linesResult.result.map(line => allCircularShifts(line)).flat())
export const sortLines = linesResult => mapResult(linesResult, orderedSet(linesResult.result.flat()))
export const filterNoiseWords = (linesResult, noiseWords = NOISE_WORDS) => mapResult(linesResult, linesResult.result.filter(line =>
	!noiseWords[line.trim().split(' ')[0].toLowerCase().replace(',', '')]))

// ---- Display function
export const display = list => list.join('\n')

// ---- KWIC Pipeline as per instructions (Version 1)
export const KWIC = lines => pipe(
	processInput(isValidLines), // verifies input is correct and returns result 
	convertLines, // converts lines to set and remove extra whitespaces and empty lines (removes duplicates, extra whitespaces, and empty lines)
	allCircularShiftsAllLines, // makes a list of list containing all the circular shifts for each line
	sortLines, // takes a list of lines, removes duplicate lines, then sorts them line-by-line and character-by-character, and returns a result
)(lines)

// ---- KWIC Pipeline as per instructions (Version 2, A5) (Pipe and Filter with extra filterNoiseWords)
export const KWICv2 = lines => pipe(
	processInput(isValidLines), // verifies input is correct and returns result 
	convertLines, // converts lines to set and remove extra whitespaces and empty lines (removes duplicates, extra whitespaces, and empty lines)
	allCircularShiftsAllLines, // makes a list of list containing all the circular shifts for each line
	sortLines, // takes a list of lines, removes duplicate lines, then sorts them line-by-line and character-by-character, and returns a result
	filterNoiseWords, // No line prefix of (lower/upper case): “a”, “an”, “the”, “and”, “or”, “of”, “to”, “be”, “is”, “in”, “out”, “by”, “as”, “at”, “off”
)(lines)

// ---- KWIC Pipeline as per instructions (Version 3, A7) (Shared Data and OOP)

// ---- KWIC Pipeline as per instructions (Version 4, A8) (Microminer)
export const KWICv4 = URLs => lines => pipe(
	processInput(isValidLinesMicrominer), // verifies input is correct and returns result 
	convertLines, // converts lines to set and remove extra whitespaces and empty lines (removes duplicates, extra whitespaces, and empty lines)
	allCircularShiftsAllLinesMicrominer(URLs), // makes a list of list containing all the circular shifts for each line, injects the prefix, then flattens 
	sortLines, // takes a list of lines, removes duplicate lines, then sorts them line-by-line and character-by-character, and returns a result
	filterNoiseWords, // No line prefix of (lower/upper case): “a”, “an”, “the”, “and”, “or”, “of”, “to”, “be”, “is”, “in”, “out”, “by”, “as”, “at”, “off”
)(lines)