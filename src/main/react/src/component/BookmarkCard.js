import React, {Component} from 'react'
import Card, {CardContent} from 'material-ui/Card'
import Menu, {MenuItem} from 'material-ui/Menu'
import {Typography, Button} from 'material-ui'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import EditBookmarkModal from './EditBookmarkModal.js'
import DeleteBookmarkModal from './DeleteBookmarkModal.js'
import AddToFolderModal from './AddToFolderModal.js'
import {changeBookmark, removeBookmark} from '../utils/fetchBookmarkData.js'
import {translate} from 'react-i18next'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'

/* global ChangeBookmarkURL */
/* global RemoveBookmarkURL */

const styles = theme => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fafafa'
  },
  textDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  icon: {
    padding: 0,
    minWidth: 20 
  },
  iconDetails: {
    flex: 0,
    justifyContent: 'flex-end',
    padding: 0,
    margin: 15 
  },
  font: {
    fontSize: 'inherit'
  }
})

class BookmarkCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      anchor: undefined,
      expanded: false,
      edit: false,
      open: false,
      remove: false,
      add: false
    }
  }

  openEdit = () => {
    this.setState({edit: true, open: false})
  }

  openDelete = () => {
    this.setState({remove: true, open: false})
  }

  openAddToFolder = () => {
    this.setState({add: true, open: false})
  }

  addToFolder = folder => {
    this.props.addToFolderClick(folder, this.props.id)
  }

  closeAddToFolder = () => {
    this.setState({add: false})
  }

  openMenu = event => {
    this.setState({open: true, anchor: event.currentTarget})
  }

  closeMenu = () => {
    this.setState({open: false})
  }

  setNewData(data) {
    this.props.newData(data)
  }

  editBookmarkClick = data => {
    const {edit} = this.state
    if (edit) {
      changeBookmark(ChangeBookmarkURL, this.props.id, 'root', data)
        .then(data => {
          this.props.newData(data)
        })
        .catch(error => {})
    }
  }

  closeEdit = () => {
    this.setState({edit: false})
  }

  deleteBookmarkClick = () => {
    removeBookmark(RemoveBookmarkURL, 'root', this.props.id)
      .then(data => {
        this.props.newData(data)
      })
      .catch(error => {})
  }

  closeDelete = () => {
    this.setState({remove: false})
  }

  getTitle() {
    const {classes, url, title} = this.props

    return (
      <a tabIndex="0" className={classes.font} target="_blank" href={url}>
        {title}
      </a>
    )
  }

  getMenu(t) {
    const {classes} = this.props
    const {open, anchor} = this.state

    return (
      <Menu open={open} anchorEl={anchor} onClose={this.closeMenu}>
        <MenuItem className={classes.font} onClick={this.openEdit}>
          {t('edit', {})}
        </MenuItem>
        <MenuItem className={classes.font} onClick={this.openDelete}>
          {t('delete', {})}
        </MenuItem>
        <MenuItem className={classes.font} onClick={this.openAddToFolder}>
          {t('addToFolder', {})}
        </MenuItem>
      </Menu>
    )
  }

  getIconButton(t) {
    const {classes} = this.props

    return (
      <Button
        tabIndex="0"
        size="medium"
        className={classes.icon}
        aria-label={t('bookmarkMenu', {})}
        onClick={this.openMenu}
      >
        <MoreVertIcon />
      </Button>
    )
  }

  getSubTitle() {
    const {url} = this.props
    if (Object.is(url, undefined)) {
      return ''
    } else {
      let hostname
      if (url.indexOf('://') > -1) {
        hostname = url.split('/')[2]
      } else {
        hostname = url.split('/')[0]
      }

      hostname = hostname.split(':')[0]
      hostname = hostname.split('?')[0]

      if (hostname.length > 25) {
        const name = hostname.split('.')
        if (Object.is(name[0].length, 3)) {
          hostname = name[1]
        } else {
          hostname = name[0]
        }
      }

      if (hostname.length > 20) {
        hostname = hostname.substring(0, 20)
      }

      return hostname
    }
  }

  getModals() {
    const {id, title, url, folderNames} = this.props
    const {edit, remove, add} = this.state

    if (edit) {
      return (
        <EditBookmarkModal
          editBookmark={this.editBookmarkClick}
          closeEdit={this.closeEdit}
          open={edit}
          id={id}
          title={title}
          url={url}
        />
      )
    } else if (this.state.remove) {
      return (
        <DeleteBookmarkModal
          deleteBookmark={this.deleteBookmarkClick}
          closeDelete={this.closeDelete}
          open={remove}
        />
      )
    } else if (this.state.add) {
      return (
        <AddToFolderModal
          folders={folderNames}
          addToFolder={this.addToFolder}
          closeAddToFolder={this.closeAddToFolder}
          open={add}
        />
      )
    } else {
      return <div />
    }
  }

  render() {
    const {t, classes} = this.props

    return (
      <div>
        <Card className={classes.card}>
          <CardContent className={classes.textDetails}>
            {this.getTitle()}
            <Typography
              variant="subheading2"
              noWrap={false}
              style={{color: '#464646'}}
              tabIndex="0"
              secondary
            >
              {this.getSubTitle()}
            </Typography>
          </CardContent>
          <CardContent className={classes.iconDetails}>
            {this.getIconButton(t)}
          </CardContent>
        </Card>
        {this.getMenu(t)}
        {this.getModals()}
      </div>
    )
  }
}

BookmarkCard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'BookmarkCard'})(
  translate('view', {wait: true})(BookmarkCard)
)
