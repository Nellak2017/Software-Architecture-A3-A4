import React, { useState } from 'react'
import { display, pipe, KWICv2 } from '../../utils/helpers'
import '../../styles/globals.css'

import axios from 'axios'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [dbOutputText, setDBOutputText] = useState('')

  const handleInputChange = e => setInputText(e.target.value.replace(/[^a-zA-Z\n ]/g, '')) // Ensure only a..zA..Z characters are entered
  const handleResetInput = () => setInputText('')
  const handleResetOutput = () => setOutputText('')
  const handleResetDBOutput = () => setDBOutputText('')
  const handleKWIC = () => setOutputText(pipe(display)(KWICv2(inputText.trim().split('\n').filter(line => line.trim() !== '')).result))

  // const preProcessInputMicrominer -> converts input to form needed by KWIC
  // const postProcessInputMicrominer -> appends URL to each line of regular output
  // const handleMicrominer -> sets output text to be the new KWIC version (A8 Microminer)
  // make API functions file and import it here 
  // make API POST ((descriptor + URL), output)
  // make API GET ((descriptor + URL)) -> output
  // make API DELETE ((descriptor + URL))

  return (
    <div className="styledAppContainer">
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
          <button onClick={handleKWIC}>
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
          <button onClick={() => console.log('Get DB Output not implemented yet')}>
            Get DB Output
          </button>
          <button onClick={() => console.log('Set DB Output not implemented yet')}>
            Set DB Ouput
          </button>
          <button onClick={() => console.log('Set DB Output not implemented yet')}>
            Delete DB Ouput
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