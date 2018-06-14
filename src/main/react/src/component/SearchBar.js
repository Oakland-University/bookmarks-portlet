import React, {Component} from 'react'
import {Input, Paper, Button} from 'material-ui'
import List, {ListItem} from 'material-ui/List'
import ActionBookmark from 'material-ui-icons/Bookmark'
import FileCreateNewFolder from 'material-ui-icons/CreateNewFolder'
import Settings from 'material-ui-icons/Settings'
import {translate} from 'react-i18next'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'

const styles = theme => ({
  buttonStyle: {
    minWidth: "30px",
    width: 30,
    height: 30
  },
  searchStyle: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  divStyle: {
    zIndex: 10,
    position: 'absolute',
    left: 25,
    right: 25
  }
})

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
      options: [],
      optionUrls: [],
      open: false
    }
  }

  newBookmark = () => {
    this.props.newBookmarkClick()
  }

  newFolder = () => {
    this.props.newFolderClick()
  }

  newTab = (event, value) => {
    event.preventDefault()
    const win = window.open(value, '_blank')
    win.focus()
    this.setState({open: false, search: ''})
  }

  handleKey = (event, index) => {
    const {optionUrls} = this.state
    if (Object.is(event.key, 'Enter') && optionUrls.length > 0) {
      const win = window.open(optionUrls[0], '_blank')
      win.focus()
      this.setState({search: ''})
    } else if (Object.is(event.key, 'ArrowDown') && optionUrls.length > 0) {
      const element = document.getElementById('searchPaper0')
      if (!Object.is(typeof element, 'undefined') && Object.is(element, null)) {
        element.focus()
      }
    }
  }

  handleListKey = (event, index) => {
    if (Object.is(event.key, 'ArrowDown')) {
      const num = index + 1
      const element = document.getElementById('searchPaper' + num)
      if (
        !Object.is(typeof element, 'undefined') &&
        !Object.is(element, null)
      ) {
        element.focus()
      }
    } else if (Object.is(event.key, 'ArrowUp')) {
      const num = index - 1
      const element = document.getElementById('searchPaper' + num)
      if (!Object.is(typeof element, 'undefined') && Object.is(element, null)) {
        element.focus()
      } else {
        document.getElementById('search').focus()
      }
    } else if (Object.is(event.key, 'Tab')) {
      const num = index + 1
      const element = document.getElementById('searchPaper' + num)
      if (Object.is(typeof element, 'undefined') || Object.is(element, null)) {
        this.setState({open: false, search: ''})
      }
    }
  }

  getOptions = value => {
    const results = []
    const resultUrls = []
    const length = value.length
    let search = value.toLowerCase()
    const {names, urls} = this.props
    search = search.trim()

    if (!Object.is(names[0], undefined) && names.length >= 1) {
      for (let i = 0; i < names.length; i++) {
        for (let j = 0; j < names[i].length; j++) {
          let wordParts = names[i].substring(j, length + j)
          wordParts = wordParts.toLowerCase()
          wordParts = wordParts.trim()

          if (Object.is(wordParts, search)) {
            results.push(names[i])
            resultUrls.push(urls[i])
            break
          }
        }
      }
    }

    this.setState({
      search: value,
      options: results,
      optionUrls: resultUrls,
      open: true
    })
  }

  editSettings = () => {
    this.props.settingsClick()
  }

  getListItems() {
    const list = []
    const {options, optionUrls} = this.state
    let length = options.length

    if (options.length > 10) {
      length = 10
    }

    for (let i = 0; i < length; i++) {
      list.push(
        <ListItem
          button={true}
          dense={true}
          id={'searchPaper' + i}
          onClick={e => this.newTab(e, optionUrls[i])}
          onKeyDown={e => this.handleListKey(e, i)}
        >
          {options[i]}
        </ListItem>
      )
    }

    return list
  }

  getPopover() {
    if (this.state.search.length > 0) {
      return (
        <div className={this.props.classes.divStyle} display={this.state.open}>
          <Paper style={{marginLeft: 10, marginRight: 10, marginBottom: 10}}>
            <List style={{width: 200}}>
              {this.getListItems()}
            </List>
          </Paper>
        </div>
      )
    } else {
      return <div />
    }
  }

  render() {
    const {t, classes} = this.props

    return (
      <div style={{marginBottom: 10}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Input
            id="search"
            role="search"
            aria-label={t('searchBookmarks', {})}
            placeholder={t('search', {})}
            value={this.state.search}
            className={classes.searchStyle}
            onKeyDown={this.handleKey}
            onChange={event => this.getOptions(event.target.value)}
          />
          <Button
            tabIndex="0"
            className={classes.buttonStyle}
            aria-label={t('newBookmark', {})}
            onClick={this.newBookmark}
          >
            <ActionBookmark />
          </Button>
          <Button
            tabIndex="0"
            className={classes.buttonStyle}
            aria-label={t('newFolder', {})}
            onClick={this.newFolder}
          >
            <FileCreateNewFolder />
          </Button>
          <Button
            tabIndex="0"
            className={classes.buttonStyle}
            aria-label={t('settings', {})}
            onClick={this.editSettings}
          >
            <Settings />
          </Button>
          <br />
        </div>
        {this.getPopover()}
      </div>
    )
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'SearchBar'})(
  translate('view', {wait: true})(SearchBar)
)
