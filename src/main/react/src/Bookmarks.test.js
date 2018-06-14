import React from 'react'
import ReactDOM from 'react-dom'
import Bookmarks from './Bookmarks.js'

it('Bookmarks renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})
