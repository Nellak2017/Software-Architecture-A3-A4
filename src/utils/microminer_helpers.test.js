import {
	splitOnURL,
	preInput,
} from './microminer_helpers.js'

describe('splitOnURL', () => {
	const testCases = [
		{ inputText: "Apple, http://example.com", expected: ["Apple", "http://example.com"] },
		{ inputText: "Orange, http://anotherSite.org", expected: ["Orange", "http://anotherSite.org"] },
		{ inputText: "Banana, http://sub.domain.edu", expected: ["Banana", "http://sub.domain.edu"] },
		{ inputText: "Description, http://sub.domain.com", expected: ["Description", "http://sub.domain.com"] },
		{ inputText: "Alpha, beta, http://example.com", expected: ['Alpha, beta', 'http://example.com'] },
		{ inputText: "Descriptor, http://test-site.net", expected: [] }, // no dashes allowed
		{ inputText: "Apple, http://invalid-url", expected: [] },
		{ inputText: "Invalid Format", expected: [] },
		{ inputText: "12345, http://example.com", expected: [] },
		{ inputText: "http://example.com, Descriptor", expected: [] }
	]

	testCases.forEach(({ inputText, expected }) => {
		test(`correctly splits "${inputText}"`, () => {
			const result = splitOnURL(inputText)
			expect(result).toEqual(expected)
		})
	})
})

describe('preInput', () => {
	const testCases = [
		{
			description: 'Empty input array',
			input: [],
			expectedDescriptors: [],
			expectedURLs: []
		},
		{
			description: 'Single line with descriptors and URL',
			input: ['Apple, Banana, http://example.com'],
			expectedDescriptors: ['Apple, Banana,'],
			expectedURLs: ['http://example.com']
		},
		{
			description: 'Multiple lines with descriptors and URLs',
			input: [
				'Orange, http://anotherexample.net',
				'Grape, http://thirdexample.org'
			],
			expectedDescriptors: ['Orange,', 'Grape,'],
			expectedURLs: ['http://anotherexample.net', 'http://thirdexample.org']
		},
		{
			description: 'Should work on valid inputs',
			input: [
				'the, http://google.com', 
				'the, quick, http://bing.com'
			],
			expectedDescriptors: ['the,', 'the, quick,'],
			expectedURLs: ['http://google.com', 'http://bing.com']
		},
	]
	testCases.forEach(({ description, input, expectedDescriptors, expectedURLs }) => {
		test(`${description}`, () => {
		  const [actualDescriptors, actualURLs] = preInput(input)
	  
		  expect(actualDescriptors).toEqual(expectedDescriptors)
		  expect(actualURLs).toEqual(expectedURLs)
		})
	  })
})