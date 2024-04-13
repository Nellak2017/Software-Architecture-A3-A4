import axios from 'axios'

const BASE_PATH = 'http://localhost:5000/'
const GET_PATH = `${BASE_PATH}/api/circularshift`
const POST_PATH = `${BASE_PATH}/api/circularshift`
const DELETE_PATH = `${BASE_PATH}/api/circularshift`

// --- This file is the JS axios code for talking to the Flask back-end
export const getValues = async (inputString, apiURL = GET_PATH) => {
	try {
		const res = await axios.get(apiURL, {
			params: { input_string: inputString }
		})
		return res.data.values
	} catch (e) {
		if (e?.response?.data?.message) { // If the API simply doesn't have it, then return with no logging
			return []	
		}
		console.error(e)
		return []
	}
}

export const postValues = async (inputString, outputLines, apiURL = POST_PATH) => {
	try {
		const res = await axios.post(apiURL, {
			input_string: inputString,
			output_lines: outputLines
		}, {
			headers: {
				'Content-Type': 'application/json',
			}
		})
		return res.data
	} catch (e) {
		console.error(e)
		throw new Error(e)
	}
}

export const deleteValues = async (inputString, apiURL = DELETE_PATH) => {
	try {
		const res = await axios.delete(apiURL, {
			params: { input_string: inputString }
		})
		return res.data
	} catch (e) {
		console.error(e)
		throw new Error(e)
	}
}
