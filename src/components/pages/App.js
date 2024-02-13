import React, { useState } from 'react'
import { KWIC, display, pipe } from '../../utils/helpers'
import '../../styles/globals.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')

  const handleInputChange = e => {
    // Ensure only a..zA..Z characters are entered
    const filteredText = e.target.value.replace(/[^a-zA-Z\n ]/g, '')
    setInputText(filteredText)
  }

  const handleResetInput = () => setInputText('')
  const handleResetOutput = () => setOutputText('')
  const handleKWIC = () => setOutputText(pipe(display)(KWIC(inputText.split('\n')).result))

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100 overflow-y-auto p-16">
      <div className="flex flex-col space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Input</h2>
        </div>
        <textarea
          className="w-96 h-96 p-4 border border-gray-300 rounded-lg resize-none"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text here..."
        ></textarea>
        <div className='flex items-center justify-center'>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleResetInput}
          >
            Reset Input
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleResetOutput}
          >
            Reset Output
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleKWIC}
          >
            Process
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Output</h2>
        </div>
        <textarea
          className="w-96 h-96 p-4 border border-gray-300 rounded-lg resize-none"
          value={outputText}
          readOnly
          placeholder="Results will appear here..."
        ></textarea>
      </div>
    </div>
  )
}

export default App