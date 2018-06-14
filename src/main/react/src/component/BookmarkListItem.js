import React, {Component} from 'react'
import IconButton from 'material-ui/IconButton'
import Menu, {MenuItem} from 'material-ui/Menu'
import Typography from 'material-ui/Typography'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import EditBookmarkModal from './EditBookmarkModal.js'
import DeleteBookmarkModal from './DeleteBookmarkModal.js'
import {ListItem, ListItemSecondaryAction} from 'material-ui/List'
import {changeBookmark, removeBookmark} from '../utils/fetchBookmarkData.js'
import {translate} from 'react-i18next'

/* global ChangeBookmarkURL */
/* global RemoveBookmarkURL */

class BookmarkListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      anchor: undefined,
      edit: false,
      open: false,
      deleteB: false,
      remove: false
    }
  }

  editBookmark = () => {
    this.setState({edit: true, open: false})
  }

  deleteBookmark = () => {
    this.setState({deleteB: true, open: false})
  }

  removeBookmark = () => {
    this.props.removeBookmark(this.props.id)
    this.setState({remove: false, open: false})
  }

  openMenu = event => {
    this.setState({open: true, anchor: event.currentTarget})
  }

  closeMenu = () => {
    this.setState({open: false})
  }

  editBookmarkClick = data => {
    if (this.state.edit) {
      changeBookmark(ChangeBookmarkURL, this.props.id, this.props.folder, data)
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
    removeBookmark(RemoveBookmarkURL, this.props.folder, this.props.id)
      .then(data => {
        this.props.newData(data)
      })
      .catch(error => {})
  }

  closeDelete = () => {
    this.setState({deleteB: false})
  }

  getMenu(t) {
    return (
      <Menu
        open={this.state.open}
        anchorEl={this.state.anchor}
        onClose={this.closeMenu}
      >
        <MenuItem style={{fontSize: 'inherit'}} onClick={this.editBookmark}>
          {t('edit', {})}
        </MenuItem>
        <MenuItem style={{fontSize: 'inherit'}} onClick={this.deleteBookmark}>
          {t('delete', {})}
        </MenuItem>
        <MenuItem style={{fontSize: 'inherit'}} onClick={this.removeBookmark}>
          {t('removeFromFolder', {})}
        </MenuItem>
      </Menu>
    )
  }

  getIconButton(t) {
    return (
      <IconButton
        tabIndex="0"
        aria-label={t('bookmarkMenu', {})}
        onClick={this.openMenu}
      >
        <MoreVertIcon />
      </IconButton>
    )
  }

  getSubTitle() {
    if (Object.is(this.props.url, undefined)) {
      return ''
    } else {
      const url = this.props.url
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
    if (this.state.edit) {
      return (
        <EditBookmarkModal
          editBookmark={this.editBookmarkClick}
          closeEdit={this.closeEdit}
          open={this.state.edit}
          id={this.props.id}
          title={this.props.name}
          url={this.props.url}
        />
      )
    } else if (this.state.deleteB) {
      return (
        <DeleteBookmarkModal
          deleteBookmark={this.deleteBookmarkClick}
          closeDelete={this.closeDelete}
          open={this.state.deleteB}
        />
      )
    } else {
      return <div />
    }
  }

  render() {
    const {t} = this.props

    return (
      <div>
        <ListItem>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left'
            }}
          >
            <a tabIndex="0" target="_blank" href={this.props.url}>
              {this.props.name}
            </a>
            <Typography
              tabIndex="0"
              type="subheading2"
              noWrap={false}
              style={{color: '#464646'}}
              secondary
            >
              {this.getSubTitle()}
            </Typography>
          </div>
          <ListItemSecondaryAction>
            {this.getIconButton(t)}
          </ListItemSecondaryAction>
        </ListItem>
        {this.getMenu(t)}
        {this.getModals()}
      </div>
    )
  }
}

export default translate('view', {wait: true})(BookmarkListItem)
