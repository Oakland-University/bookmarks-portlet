import React, {Component} from 'react'
import Card, {CardContent} from 'material-ui/Card'
import SearchBar from './SearchBar.js'
import BookmarkCard from './BookmarkCard.js'
import FolderCard from './FolderCard.js'
import BottomPanel from './BottomPanel.js'
import EditPreferences from './EditPreferences.js'
import {addToFolder, removeBookmark} from '../utils/fetchBookmarkData.js'
import {translate} from 'react-i18next'

/* global AddToFolderURL */
/* global RemoveBookmarkURL */

class BookmarksLayout extends Component {
  constructor() {
    super()

    this.state = {
      pageNumber: 1,
      changePrefs: false
    }
  }

  changePrefs = items => {
    if (!Object.is(items, undefined)) {
      this.props.changePrefs(items)
    }
    this.setState({changePrefs: false})
  }

  closePrefs = () => {
    this.setState({changePrefs: false})
  }

  addToFold = (data, id) => {
    const bookmark = this.props.bookmarks[id]
    addToFolder(AddToFolderURL, data, bookmark).then(data => {
      removeBookmark(RemoveBookmarkURL, 'root', id).then(newBookmarks => {
        this.props.setData(newBookmarks)
      })
    })
  }

  setNewData = data => {
    this.props.setData(data)
  }

  newBookmark = () => {
    this.props.newBookmarkClick(true)
  }

  newFolder = () => {
    this.props.newFolderClick(true)
  }

  settings = () => {
    this.setState({changePrefs: true})
  }

  nextPage = () => {
    const num = this.state.pageNumber + 1
    this.setState({pageNumber: num})
  }

  prevPage = () => {
    const num = this.state.pageNumber - 1
    if (num > 0) {
      this.setState({pageNumber: num})
    }
  }

  getSearchBar() {
    const bookmarkNames = []
    const bookmarkUrls = []

    for (let i = 0; i < this.props.bookmarks.length; i++) {
      bookmarkNames.push(this.props.bookmarks[i].name)
      bookmarkUrls.push(this.props.bookmarks[i].url)
    }

    for (let i = 0; i < this.props.folderBookmarks.length; i++) {
      for (let j = 0; j < this.props.folderBookmarks[i].length; j++) {
        bookmarkNames.push(this.props.folderBookmarks[i][j].name)
        bookmarkUrls.push(this.props.folderBookmarks[i][j].url)
      }
    }

    return (
      <SearchBar
        settingsClick={this.settings}
        newBookmarkClick={this.newBookmark}
        newFolderClick={this.newFolder}
        names={bookmarkNames}
        urls={bookmarkUrls}
      />
    )
  }

  getBookmarkList() {
    let remainder = 1
    let noBookmarks = false
    const cardList = []

    if (!Object.is(this.props.preferences, null)) {
      let start = this.props.bookmarks.length - 1
      let items = this.props.preferences.itemsPerPage
      const bkmarkRange = (items - 1) * (this.state.pageNumber - 1)
      start -= bkmarkRange
      const end = start - (items - 1)

      if (
        Object.is(this.props.bookmarks.length, 0) ||
        Object.is(this.props.bookmarks, undefined)
      ) {
        this.setState({pageNumber: 1})
      }

      for (let i = start; i > end; i--) {
        if (i >= 0) {
          cardList.push(
            <BookmarkCard
              id={i}
              title={this.props.bookmarks[i].name}
              url={this.props.bookmarks[i].url}
              folderNames={this.props.folderTitles}
              addToFolderClick={this.addToFold}
              newData={this.setNewData}
            />
          )
        } else {
          remainder += 1
        }
      }
    }

    if (Object.is(cardList.length, 0) && this.props.bookmarks.length > 0) {
      noBookmarks = true
    }

    const folderList = this.getFolderList(remainder, noBookmarks)
    for (let i = 0; i < folderList.length; i++) {
      cardList.push(folderList[i])
    }

    return cardList
  }

  getFolderList(remainder, noBookmarks) {
    const start = this.state.pageNumber - 1
    const end = start + 1
    const list = []

    for (let i = start; i < end; i++) {
      if (this.props.folderTitles.length > i) {
        list.push(
          <FolderCard
            title={this.props.folderTitles[i]}
            bookmarks={this.props.folderBookmarks[i]}
            rootBookmarks={this.props.bookmarks}
            newData={this.setNewData}
          />
        )
      }
    }

    if (Object.is(list.length, 0) || this.props.bookmarks.length <= 0) {
      if (noBookmarks) {
        this.setState({pageNumber: this.state.pageNumber - 1})
      }
    }

    return list
  }

  render() {
    const {t, initialized, preferences} = this.props
    let prefStyle = {
      display: 'none'
    }

    let mainStyle = {
      display: ''
    }

    if (!initialized) {
      return (
        <div>
          {this.getSearchBar()}
          <Card style={{margin: 10}}>
            <CardContent>
              {t('unavailable', {})}
            </CardContent>
          </Card>
          <BottomPanel
            page={1}
            nextPageClick={this.nextPage}
            prevPageClick={this.prevPage}
          />
        </div>
      )
    } else if (this.state.changePrefs) {
      prefStyle.display = ''
      mainStyle.display = 'none'
    } else {
      prefStyle.display = 'none'
      mainStyle.display = ''
    }

    if (initialized) {
      return (
        <div>
          <div style={prefStyle}>
            <EditPreferences
              preferences={preferences}
              changePrefs={this.changePrefs}
              closePrefs={this.closePrefs}
            />
          </div>
          <div style={mainStyle}>
            {this.getSearchBar()}
            {this.getBookmarkList()}
            <BottomPanel
              page={this.state.pageNumber}
              nextPageClick={this.nextPage}
              prevPageClick={this.prevPage}
            />
          </div>
        </div>
      )
    }
  }
}

export default translate('view', {wait: true})(BookmarksLayout)
