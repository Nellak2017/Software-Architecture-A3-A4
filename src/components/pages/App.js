import React, { useState, useMemo } from 'react'
import { display, pipe, KWICv2, KWIC, KWICv4 } from '../../utils/helpers'
import { preInput } from '../../utils/microminer_helpers.js'
import '../../styles/globals.css'

import axios from 'axios'

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
    
  // X const splitOnURL = (line, regex='the one we use') => line.split(regex) // ['first', 'last']
  // X const preInput = (lines) => lines.map(line => splitOnURL(line)).reduce(...) // [[...descriptor],[...URL]]
  // R const postInput = (URLs) => (descriptors) => descriptors.map((descriptor, i) => descriptor.concat(URLs[i]))
  // X const KWICv4 = (URLs) => (descriptors) => pipe(KWICv2, postInput(URLs))(descriptors)
  // X const handleMicrominer = () => setsOutputText(pipe(display)(KWICv4(URLs)(descriptors).result))
  // make API functions file and import it here 
  // make API POST ((descriptor + URL), output)
  // make API GET ((descriptor + URL)) -> output
  // make API DELETE ((descriptor + URL))
  // 4+1 view model
  // UML diagram for functional requirements
  // UML component diagram for the architecture style
  // UML deployment diagram
  // UML class diagram for design

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