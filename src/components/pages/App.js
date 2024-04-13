import React, { useState, useMemo } from 'react'
import { display, pipe, KWICv4 } from '../../utils/helpers'
import { preInput } from '../../utils/microminer_helpers.js'
import '../../styles/globals.css'
import {
  getValues,
  postValues,
  deleteValues,
} from '../../API/api.js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [dbOutputText, setDBOutputText] = useState('')

  const input = useMemo(() => inputText.trim().split('\n').filter(line => line.trim() !== ''), [inputText])

  const handleInputChange = e => setInputText(e.target.value.replace(/[^0-9a-zA-Z\n, :/.]/g, '')) // Ensure only 0-9a..zA..Z characters are entered or ',' or ':' or '/' or '.'
  const handleResetInput = () => setInputText('')
  const handleResetOutput = () => setOutputText('')
  const handleResetDBOutput = () => setDBOutputText('')
  const handleMicrominer = () => {
    const [descriptors, URLs] = preInput(input)
    setOutputText(pipe(display)(KWICv4(URLs)(descriptors).result))
  }

  // -- API handlers
  // NOTE: For the inputStringList of these, we use the input memo since it does further pre-processing than just raw string above
  const handleGetValues = async (inputStringList) => {
    const processedGETInput = inputStringList && Array.isArray(inputStringList) ? inputStringList.join('\n') : ''
    try {
      const values = await getValues(processedGETInput)
      if (!values || values?.length === 0) {
        console.warn('Values returned an empty list. Could not find Stored Output for that input.')
        toast.warn('Could not find Stored Output for that input.')
        return
      }
      toast.success('Circular shifts fetched successfully')
      values && values[0] && Array.isArray(values)
        ? setDBOutputText(values[0])
        : setDBOutputText(values)
    } catch (e) {
      setDBOutputText('Could not fetch for that input. Something unexpected happened. Try another input or Set DB Output.')
      toast.error('Could not fetch for that input. Something unexpected happened. Try another input or Set DB Output.')
      console.error(e)
    }
  }
  const handlePostValues = async (inputStringList, outputLines) => {
    try {
      if (!inputStringList || !outputLines) { throw new Error('Input string and output lines are required') }

      const processedInput = inputStringList && Array.isArray(inputStringList) ? inputStringList.join('\n') : ''
      const processedDbOutput = outputLines && typeof outputLines === 'string' ? outputLines.trim().split('\n').filter(line => line.trim() !== '') : []
      const dbOutputText = processedDbOutput?.join('\n') || ''

      const existingValues = await getValues(processedInput)
      if (existingValues && existingValues.length > 0) {
        toast.warn('Input/Output pair already exists in the database')
        setDBOutputText(dbOutputText)
        return
      }

      const res = await postValues(processedInput, processedDbOutput)
      toast.success(res.message || 'Circular shifts added successfully')
      setDBOutputText(dbOutputText)
    } catch (e) {
      console.error(e)
      toast.error(e.message || 'Failed to Post values')
    }
  }
  const handleDeleteValues = async (inputStringList) => {
    const processedInput = inputStringList && Array.isArray(inputStringList) ? inputStringList.join('\n') : ''
    try {
      const res = await deleteValues(processedInput)
      toast.success(res?.message || 'Values deleted successfully')
      setDBOutputText('')
    } catch (e) {
      console.error(e)
      toast.error('Failed to delete values')
    }
  }

  // X const splitOnURL = (line, regex='the one we use') => line.split(regex) // ['first', 'last']
  // X const preInput = (lines) => lines.map(line => splitOnURL(line)).reduce(...) // [[...descriptor],[...URL]]
  // R const postInput = (URLs) => (descriptors) => descriptors.map((descriptor, i) => descriptor.concat(URLs[i]))
  // X const KWICv4 = (URLs) => (descriptors) => pipe(KWICv2, postInput(URLs))(descriptors)
  // X const handleMicrominer = () => setsOutputText(pipe(display)(KWICv4(URLs)(descriptors).result))
  // X make API functions file and import it here 
  // X make API POST ((descriptor + URL), output)
  // X make API GET ((descriptor + URL)) -> output
  // X make API DELETE ((descriptor + URL))
  // X Client handlers for API stuff
  // 4+1 view model
  // UML diagram for functional requirements
  // UML component diagram for the architecture style
  // UML deployment diagram
  // UML class diagram for design

  return (
    <div className="styledAppContainer">
      <ToastContainer position="bottom-left" autoClose={3000} />
      <div className="content">
        <div>
          <h1>Key Word In Context System</h1>
        </div>
        <div>
          <h2>Input</h2>
        </div>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text here..."
        ></textarea>
        <div className='buttons'>
          <button onClick={handleMicrominer}>
            Compute
          </button>
          <button onClick={handleResetInput}>
            Reset Input
          </button>
          <button onClick={handleResetOutput}>
            Reset Output
          </button>

          <button onClick={handleResetDBOutput}>
            Reset DB Output
          </button>
          <button onClick={() => handleGetValues(input)}>
            Get DB Output
          </button>
          <button onClick={() => {
            const [descriptors, URLs] = preInput(input)
            handlePostValues(input, pipe(display)(KWICv4(URLs)(descriptors).result))
          }}>
            Set DB Output
          </button>
          <button onClick={() => handleDeleteValues(input)}>
            Delete DB Output
          </button>

        </div>
        <div>
          <h2>Output</h2>
        </div>
        <textarea
          value={outputText}
          readOnly
          placeholder="Results will appear here..."
        ></textarea>
        <div>
          <h2>Output from Database</h2>
        </div>
        <textarea
          value={dbOutputText}
          readOnly
          placeholder="Results will appear here when you load them in from the database..."
        ></textarea>
      </div>
    </div>
  )
}

export default App