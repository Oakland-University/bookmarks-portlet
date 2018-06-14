import React, {Component} from 'react'
import BookmarksLayout from './component/BookmarksLayout.js'
import BookmarksModals from './component/BookmarksModals.js'
import {getDemoData} from './utils/demoData.js'
import {getData, addUser, addPref} from './utils/fetchBookmarkData.js'
import Reboot from 'material-ui/Reboot'

/* global CreateUserURL */
/* global CreatePrefURL */
/* global BookmarksURL */
/* global GetPreferencesURL */

class Bookmarks extends Component {
  constructor() {
    super()

    this.state = {
      bookmarks: [],
      folderTitles: [],
      folderBookmarks: [],
      folders: [],
      preferences: null,
      error: false,
      newBookmark: false,
      newFolder: false,
      initialized: false
    }
  }

  componentDidMount() {
    getData(BookmarksURL)
      .then(bookmarks => {

        if (Object.is(bookmarks, undefined) || bookmarks.bookmarks.length === 0) {
          this.getNewUserData()
          this.setState({error: false})
        } else {
          getData(GetPreferencesURL)
            .then(prefs => {
              if (Object.is(prefs.itemsPerPage, undefined)) {
                this.createPref()
              } else {
                this.setState({preferences: prefs})
              }
              this.setState({error: false})
              this.setBookmarkData(bookmarks)
            })
            .catch(err => {
              this.createPref()
            })
        }
      })
      .catch(err => {})
  }

  createPref(data) {
    addPref(CreatePrefURL)
      .then(bookmark => {
        this.setState({preferences: {itemsPerPage: 3}, error: false})
        if (!Object.is(data, undefined)) {
          this.setBookmarkData(data)
        }
      })
      .catch(err => {
        this.setState({error: true})
      })
  }

  createUser(data) {
    addUser(CreateUserURL, data)
      .then(bookmark => {
        this.createPref(bookmark)
      })
      .catch(err => {
        this.setState({error: true})
      })
  }

  isJSON(data) {
    try {
      JSON.parse(data)
      return true
    } catch (e) {
      return false
    }
  }

  getNewUserData() {
    const newData = getDemoData()
    this.createUser(newData)
  }

  appendProtocol(bookmarks) {
    const newBookmarks = []
    for (let i = 0; i < bookmarks.length; i++) {
      let proto = bookmarks[i].url.split('//')
      if (proto.length < 2) {
        const newUrl = 'http://' + bookmarks[i].url
        newBookmarks.push({
          url: newUrl,
          name: bookmarks[i].name,
          created_at: bookmarks[i].created_at,
          description: bookmarks[i].description
        })
      } else {
        newBookmarks.push(bookmarks[i])
      }
    }

    return newBookmarks
  }

  setBookmarkData(bookmark) {
    const folders = []
    let rootLoc = 0

    const data = JSON.parse(bookmark.bookmarks)
    const fold = Object.keys(data).map(key => data[key])
    const newBookmarks = this.appendProtocol(data.root)
    let foldNames = Object.keys(data)

    for (let i = 0; i < foldNames.length; i++) {
      if (Object.is(foldNames[i], 'root')) {
        foldNames.splice(i, 1)
        rootLoc = i
      }
    }

    if (Object.is(data.root.length, 0) && Object.is(foldNames.length, 0)) {
      this.setState({error: true})
    } else {
      this.setState({error: false})

      for (let i = 0; i < fold.length; i++) {
        if (!Object.is(i, rootLoc)) {
          folders.push(fold[i])
        }
      }

      this.setState({
        initialized: true,
        bookmarks: newBookmarks,
        folderTitles: foldNames,
        folderBookmarks: folders
      })
    }
  }

  newBookmark = arg => {
    this.setState({newBookmark: arg})
  }

  newFolder = arg => {
    this.setState({newFolder: arg})
  }

  setData = data => {
    this.setBookmarkData(data)
  }

  setError = () => {
    this.setState({error: true})
  }

  prefsChanged = prefs => {
    this.setState({preferences: prefs})
  }

  render() {
    return (
      <div>
        <Reboot/>
        <BookmarksModals
          newBookmark={this.state.newBookmark}
          newFolder={this.state.newFolder}
          bookmarks={this.state.bookmarks}
          newBookmarkClick={this.newBookmark}
          newFolderClick={this.newFolder}
          setData={this.setData}
          setError={this.setError}
        />
        <BookmarksLayout
          bookmarks={this.state.bookmarks}
          preferences={this.state.preferences}
          changePrefs={this.prefsChanged}
          folders={this.state.folders}
          folderTitles={this.state.folderTitles}
          folderBookmarks={this.state.folderBookmarks}
          initialized={this.state.initialized}
          error={this.state.error}
          newBookmarkClick={this.newBookmark}
          newFolderClick={this.newFolder}
          setData={this.setData}
          setError={this.setError}
        />
      </div>
    )
  }
}

export default Bookmarks
