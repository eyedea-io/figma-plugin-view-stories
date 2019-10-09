import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {App} from './app'
import './components/figma/style.scss'
import {DndProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

ReactDOM.render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>,
  document.getElementById('react-page')
)
