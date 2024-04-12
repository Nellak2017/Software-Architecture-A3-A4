import {
	mapResult,
	allCircularShifts,
} from './helpers.js'

// -- Microminer Predicates
export const isLetterMicrominer = char => !char || typeof char !== 'string' || char.length > 1 ? false : /^[a-zA-Z0-9,\/.:]+$/.test(char) // A letter is  only 0-9a..zA..Z characters are entered or ',' or ':' or '/' or '.' only
export const isWordMicrominer = word => typeof word === 'string' && word.length >= 1 && Array.from(word).every(isLetterMicrominer) // A word is a string of characters 
export const isLineMicrominer = line =>
	typeof line === 'string'
	&& line.length >= 1
	&& Array.from(line).filter(char => char !== ' ').every(isWordMicrominer)
export const isValidLinesMicrominer = lines => Array.isArray(lines) && lines.length >= 1 && lines.some(line => isLineMicrominer(line)) // every makes it to where if one fails they all fail

// ---- Processing functions for Microminer
export const splitOnURL = line => {
	const match = line.match(/^([a-zA-Z\s]+(?:,\s+[a-zA-Z\s]+)*),\s*(http:\/\/[a-zA-Z0-9.]+\.(?:com|org|net|edu))/i)
	return match && match.length === 3
		? [match[1].trim(), match[2]]
		: []
}
export const preInput = lines =>
	lines
		.map(line => splitOnURL(line))
		.reduce((acc, [descriptors, URLs]) => ([
			[...acc[0], descriptors?.concat(',') ?? ''],
			[...acc[1], URLs ?? '']
		]), [[], []])

export const prefixDescriptors = (descriptor, URLs, i) => `${descriptor} ${URLs.filter(URL => URL !== '')?.[i] ?? ''}`

// -- Microminer Result returning functions
export const allCircularShiftsAllLinesMicrominer = URLs => linesResult => mapResult(linesResult,
	linesResult.result
		.map((line, i) => allCircularShifts(line)
			.map(line => prefixDescriptors(line, URLs, i)))
		.flat())



