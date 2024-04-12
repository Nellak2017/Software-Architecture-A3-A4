// This will have the OO / shared data solution quarantined
import { NOISE_WORDS } from "./helpers"

export class Input {
	// constructor(lineStorage)
	// lineStorage class is data
	// read() method: read data lines from input medium
	// store(?) method: store data lines by calling the setchar of Line Storage 
	constructor(lineStorage) { this.lineStorage = lineStorage }

	// read data lines from input medium
	read(lines) { lines.forEach(lineText => this.lineStorage.setLine(lineText.trim().split(/\s+/))) }
}

export class LineStorage {
	/*
	 Create, access, and possibly delete characters,
	words, and lines
	 Actual representations and processing
	algorithms are hidden
	*/
	// unknown if has constructor
	// Characters is data
	// setChar(l,w,c,d): used by Input module. Causes cth char in the wth word of the lth line to be d
	// getChar(l,w,c): returns int repr cth char in wth word of ith line, else blank if out of range
	// word(l): returns # of words in line l

	// Notes: if setchar(l,w,c,d) then getchar(l,w,c) = d

	constructor(lines) {
		if (!lines) { this.lines = [] }
		else { this.lines = lines }
	}

	setLine(lineText) { this.lines.push(lineText) }

	setChar(lineIndex, wordIndex, charIndex, char) {
		if (this.lines[lineIndex] && this.lines[lineIndex][wordIndex] && this.lines[lineIndex][wordIndex][charIndex]) {
			const wordArray = this.lines[lineIndex][wordIndex].split('') // Convert string to array of characters
			wordArray[charIndex] = char // Modify the character at charIndex
			this.lines[lineIndex][wordIndex] = wordArray.join('') // Join array back into a string
		}
	}

	getChar(lineIndex, wordIndex, charIndex) {
		if (this.lines[lineIndex] && this.lines[lineIndex][wordIndex]) {
			return this.lines[lineIndex][wordIndex][charIndex] || ''
		}
		return ''
	}

	wordCount(lineIndex) {
		return this.lines[lineIndex].length
	}
}

export class CircularShift {
	/* 
	 Creates virtual lines of the circular shifts of the stored
	lines
	 Provides routines to access individual characters and
	words in the shifted lines
	*/
	// Char and index is data
	// setup(): get a title(s) using char and word of Circular Shift, used to construct circular shift
	// cs-setchar(s,w,c,e): causes c-th char in the wth word of the sth circular shift to be e, used to construct circular shift 
	// cs-getchar(s,w,c): returns the cth char in the wth word in the sth circular shift, used by Alphabetizer to reconstruct the circular shifts of the lines 
	// cs-word(?): ?? Not defined, but example given

	/* 
	Examples given:

	cs-setchar(1,1,1, “P”)
	cs-setchar(1,3,5, “e”)
	cs-setchar(2,1,1, “a”)
	cs-setchar(2,3,3, “p”)
	cs-setchar(3,2,2, “i”)
	cs-getchar(1,1,1) = “P”
	cs-getchar(1,3,5) = “e”
	cs-getchar(2,1,1) = “a”
	cs-getchar(2,3,3) = “p”
	cs-getchar(3,2,2) = “i”
	cs-word(1) = 3
	*/
	constructor(lineStorage) {
		this.lineStorage = lineStorage
		this.shifts = []
	}

	setup() {
		for (const element of this.lineStorage.lines) {
			const line = element
			for (let j = 0; j < line.length; j++) {
				const shift = []
				for (let k = 0; k < line.length; k++) {
					const wordIndex = (j + k) % line.length
					shift.push(line[wordIndex])
				}
				this.shifts.push(shift)
			}
		}
	}

	setChar(shiftIndex, wordIndex, charIndex, char) {
		if (this.shifts[shiftIndex] && this.shifts[shiftIndex][wordIndex]) {
			const wordArray = this.shifts[shiftIndex][wordIndex].split('')
			wordArray[charIndex] = char
			this.shifts[shiftIndex][wordIndex] = wordArray.join('')
		}
	}

	getChar(shiftIndex, wordIndex, charIndex) {
		if (this.shifts[shiftIndex] && this.shifts[shiftIndex][wordIndex]) {
			return this.shifts[shiftIndex][wordIndex][charIndex] || ''
		}
		return ''
	}

	wordCount(shiftIndex) {
		return this.shifts[shiftIndex].length
	}
}

export class Alphabetizer {
	/* 
	 Creates alphabetized lines of the circular shifts
	using cs-getchar and cs-word
	 Provides routines to access shifted lines in
	alphabetical order
	*/
	// Char and index is data
	// alph(?) : use Circular_Shift.cs-getchar and Circular_Shift.cs-word to get shifted lines and create alphabetized lines
	// i-th(?) : returns the index of the circular shift which comes i-th in the ordering
	constructor(circularShift) {
		this.circularShift = circularShift;
		this.alphabetizedLines = [];
	}

	customSort(a, b) {
		const charPairs = [...Array.from({ length: Math.min(a.length, b.length) }, (_, i) => [a[i], b[i]])]
		const index = charPairs.findIndex(([charA, charB]) => charA !== charB)
		if (index !== -1) {
			const [charA, charB] = charPairs[index]
			// Check if both characters are letters
			if (/[a-zA-Z]/.test(charA) && /[a-zA-Z]/.test(charB)) {
				return charA.localeCompare(charB)
			} else {
				// If both characters are not letters, compare based on ASCII value
				return charA.charCodeAt(0) - charB.charCodeAt(0)
			}
		}
		// If characters are equal, or one is a prefix of the other, compare their lengths
		return a.length - b.length
	}

	alph() {
		// Sort circular shifts alphabetically
		this.alphabetizedLines = this.circularShift.slice().sort(this.customSort)
	}

	// skipped ith index thing, it is redundant
}

class Output {
	/*
	calls Alphabetizer.i-th to
	produce 1st , 2nd, ..., KWIC index
	*/
	constructor(alphabetizer) {
		this.alphabetizer = alphabetizer
	}

	generateKWICIndex() {
		for (const element of this.alphabetizer.alphabetizedLines) {
			return this.alphabetizer.alphabetizedLines
		}
	}
}

export class MasterControl {
	/* 
	 Input
	 Circular Shift
	 Alphabetizer
	 Output
	*/
	constructor(input, circularShift, alphabetizer, output) {
		this.input = input
		this.circularShift = circularShift
		this.alphabetizer = alphabetizer
		this.output = output
	}

	// Orchestrates the flow of data and operations
	orchestrate(lines) {
		this.input.read(lines)
		this.circularShift.setup()
		this.alphabetizer.alph()
		this.output.generateKWICIndex()
	}
}


export const KWICv3 = inputLines => {
	// Instantiate the necessary objects
	const lineStorage = new LineStorage()
	const input_ = new Input(lineStorage)
	input_.read(inputLines)

	const circularShift = new CircularShift(lineStorage)
	circularShift.setup()
	const alphabetizer = new Alphabetizer(circularShift.shifts)
	alphabetizer.alph()

	const sortedLines = alphabetizer.alphabetizedLines.map(innerList => innerList.join(' '))

	// Manually filter noise words, I am sick of OOP over-engineering
	const filterNoiseWords = (lines, noiseWords = NOISE_WORDS) => lines.filter(line => !noiseWords[line.trim().split(' ')[0].toLowerCase()])

	const filteredOutput = filterNoiseWords(sortedLines)

	// Retrieve the KWIC index from the Output object
	return filteredOutput
}


/*

Non-functional requirements

Modifiability
 Changes in processing algorithms, e.g.
 Line shifting
 One at a time as it is read
 All after they are read
 On demand when the alphabetization requires
a new set of shifted lines
 batch alphabetizer vs incremental alphabetizer
 Changes in data representation, e.g.
 Storing characters, words and lines in 1-D/2-D
array/linked list, compressed/uncompressed
 Explicitly/implicitly (as pairs of index and offset)
 Core storage/secondary storage
Not affect others
Not affect others
25
+Non-Functional Requirements
 Enhanceability
 Enhancement to system function, e.g.,
 eliminate noise words (a, an, the, and, etc.)
 The user deletes lines from the original or shifted lines
 Performance
 Space and time
 Reusability
 To what extent can the components serve as reusable
entities
 better supported than Shared Data, as modules make
fewer assumptions about the others with which they
interact, e.g.,
 Circular_shift is not dependent on the data representation
in Input as in Shared Data
 Alphabetizer can assume Circular_shift returns all lines in
full
Little changes
can be poorer than Shared Data,
due to duplication and reconstruction
26
+Properties of Solution 3
Module interfaces are abstract
 Hide data representations
 Could be array+indices, as before
 Lines could be stored explicitly
 Hide internal algorithm used to process that data
 Require users to follow a protocol for correct use
 Initialization
 Error handling
 Allows work to begin on modules before data
representations are designed
 Could result in same executable code as shared
data

*/
