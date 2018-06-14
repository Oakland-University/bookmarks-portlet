import React, {Component} from 'react'
import Card, {CardContent, CardActions} from 'material-ui/Card'
import {Typography, List, Button} from 'material-ui'
import Menu, {MenuItem} from 'material-ui/Menu'
import Collapse from 'material-ui/transitions/Collapse'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import ExpandLessIcon from 'material-ui-icons/ExpandLess'
import DeleteFolderModal from './DeleteFolderModal.js'
import EditFolderModal from './EditFolderModal.js'
import BookmarkListItem from './BookmarkListItem.js'
import {
  removeFolder,
  changeFolder,
  removeFromFolder
} from '../utils/fetchBookmarkData.js'
import {translate} from 'react-i18next'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'

/* global RemoveFolderURL */
/* global ChangeFolderURL */
/* global RemoveFromFolderURL */

const styles = theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fafafa'
  },
  titleDetails: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    margin: 15
  },
  textDetails: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    padding: 0
  },
  iconDetails: {
    flex: 0,
    justifyContent: 'flex-end',
    padding: 0,
    margin: 15
  },
  icon: {
    padding: 0,
    minWidth: 20 
  },
  expandDetails: {
    display: 'flex',
    flexDirection: 'column',
    margin: 0
  },
  actionStyle: {
    height: 20,
    marginBottom: 15
  },
  font: {
    fontSize: 'inherit'
  }
})

class FolderCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      anchor: undefined,
      expanded: false,
      label: null,
      remove: false,
      open: false,
      error: false,
      edit: false
    }
  }

  componentDidMount() {
    this.setState({label: this.props.t('expand', {})})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      expanded: false,
      open: false
    })
  }

  openEdit = () => {
    this.setState({edit: true, open: false})
  }

  openDelete = () => {
    this.setState({remove: true, open: false})
  }

  openMenu = event => {
    this.setState({open: true, anchor: event.currentTarget})
  }

  closeMenu = () => {
    this.setState({open: false})
  }

  expandFolder = () => {
    const {t} = this.props
    if (!this.state.expanded) {
      const col = t('collapse', {})
      this.setState({label: col})
    } else {
      const exp = t('expand', {})
      this.setState({label: exp})
    }

    this.setState({expanded: !this.state.expanded})
  }

  removeBookmark = data => {
    const {title, bookmarks} = this.props
    removeFromFolder(RemoveFromFolderURL, title, bookmarks[data], data)
      .then(bookmarks => {
        this.props.newData(bookmarks)
      })
      .catch(error => {})
  }

  setNewData = data => {
    this.props.newData(data)
  }

  deleteFolderClick = () => {
    removeFolder(RemoveFolderURL, this.props.title)
      .then(data => {
        this.props.newData(data)
        this.closeDelete()
      })
      .catch(error => {})
  }

  closeDelete = () => {
    this.setState({remove: false})
  }

  editFolderClick = title => {
    changeFolder(ChangeFolderURL, this.props.title, title)
      .then(bookmarks => {
        this.props.newData(bookmarks)
        this.closeEdit()
      })
      .catch(error => {})
  }

  closeEdit = () => {
    this.setState({edit: false})
  }

  getIconButton(t) {
    const {classes} = this.props
    return (
      <Button
        tabIndex="0"
        size="medium"
        className={classes.icon}
        aria-label={t('folderMenu', {})}
        onClick={this.openMenu}
      >
        <MoreVertIcon />
      </Button>
    )
  }

  getMenu(t) {
    const classes = this.props.classes
    return (
      <Menu
        open={this.state.open}
        anchorEl={this.state.anchor}
        onClose={this.closeMenu}
      >
        <MenuItem className={classes.font} onClick={this.openEdit}>
          {t('edit', {})}
        </MenuItem>
        <MenuItem className={classes.font} onClick={this.openDelete}>
          {t('delete', {})}
        </MenuItem>
      </Menu>
    )
  }

  getFolder() {
    const list = []

    for (let i = 0; i < this.props.bookmarks.length; i++) {
      list.push(
        <BookmarkListItem
          id={i}
          folder={this.props.title}
          newData={this.setNewData}
          removeBookmark={this.removeBookmark}
          name={this.props.bookmarks[i].name}
          url={this.props.bookmarks[i].url}
        />
      )
    }

    return list
  }

  getModals() {
    if (this.state.edit) {
      return (
        <EditFolderModal
          editFolder={this.editFolderClick}
          closeEdit={this.closeEdit}
          open={this.state.edit}
          title={this.props.title}
        />
      )
    } else if (this.state.remove) {
      return (
        <DeleteFolderModal
          deleteFolder={this.deleteFolderClick}
          closeDelete={this.closeDelete}
          open={this.state.remove}
        />
      )
    }
  }

  getExpandButton(t) {
    if (this.state.expanded) {
      return (
        <Button
          tabIndex="0"
          size="medium"
          onClick={this.expandFolder}
          aria-label={t('collapseFolder', {})}
          style={{margin: 0}}
        >
          <ExpandLessIcon />
        </Button>
      )
    } else if (!this.state.expanded) {
      return (
        <Button
          tabIndex="0"
          size="medium"
          onClick={this.expandFolder}
          aria-label={t('expandFolder', {})}
          style={{margin: 0}}
        >
          <ExpandMoreIcon />
        </Button>
      )
    }
  }

  render() {
    const {t, classes, title} = this.props

    return (
      <div>
        <Card className={classes.card}>
          <CardContent className={classes.textDetails}>
            <div className={classes.titleDetails}>
              <Typography tabIndex="0" variant="heading3">
                {title}
              </Typography>
              <Typography tabIndex="0" variant="subheading2" secondary>
                {t('folder', {})}
              </Typography>
            </div>
            <div className={classes.iconDetails}>
              {this.getIconButton(t)}
            </div>
          </CardContent>
          <CardActions
            disableActionSpacing={true}
            className={classes.actionStyle}
          >
            {this.getExpandButton(t)}
            <Typography variant="heading3">
              {this.state.label}
            </Typography>
          </CardActions>
          <Collapse
            in={this.state.expanded}
            className={classes.card}
            transitionDuration="auto"
            unmountOnExit
          >
            <CardContent className={classes.expandDetails}>
              <List dense={true}>
                {this.getFolder()}
              </List>
            </CardContent>
          </Collapse>
        </Card>
        {this.getMenu(t)}
        {this.getModals()}
      </div>
    )
  }
}

FolderCard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'FolderCard'})(
  translate('view', {wait: true})(FolderCard)
)
