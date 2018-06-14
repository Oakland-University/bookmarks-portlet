import React, {Component} from 'react'
import NewBookmarkModal from './NewBookmarkModal.js'
import NewFolderModal from './NewFolderModal.js'

class BookmarksModals extends Component {
  setNewData = bkmarks => {
    this.props.setData(bkmarks)
  }

  closeBookmarkModal = () => {
    this.props.newBookmarkClick(false)
  }

  closeFolderModal = () => {
    this.props.newFolderClick(false)
  }

  error = () => {
    this.props.setError()
  }

  render() {
    if (!Object.is(this.props.bookmarks, undefined)) {
      return (
        <div>
          <NewFolderModal
            open={this.props.newFolder}
            newData={this.setNewData}
            closeModal={this.closeFolderModal}
            setError={this.error}
          />
          <NewBookmarkModal
            open={this.props.newBookmark}
            bookmarks={this.props.bookmarks}
            newData={this.setNewData}
            closeModal={this.closeBookmarkModal}
            setError={this.error}
          />
        </div>
      )
    } else {
      return <div />
    }
  }
}

export default BookmarksModals
