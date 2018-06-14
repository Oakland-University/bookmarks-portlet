import React, {Component} from 'react'
import {Button, Typography, Input} from 'material-ui'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import {addBookmark} from '../utils/fetchBookmarkData.js'
import {translate} from 'react-i18next'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'

const styles = theme => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary[400],
    paddingRight: 200
  },

  input: {
    fontSize: 12,
    display: 'flex',
    marginTop: '1em',
    marginBottom: '1em'
  }
})

/* global AddBookmarkURL */

class NewBookmarkModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      url: '',
      nameError: false,
      urlError: false
    }
  }

  saveBookmark = () => {
    const bookmark = []
    const titleLen = this.state.title.length
    const urlLen = this.state.url.length
    let error = false

    if (Object.is(titleLen, 0) || titleLen > 100) {
      error = true
      this.setState({nameError: true})
    }
    if (Object.is(urlLen, 0)) {
      error = true
      this.setState({urlError: true})
    }
    if (!this.state.url.includes('.')) {
      error = true
      this.setState({urlError: true})
    }

    if (!error) {
      bookmark.push(this.state.title)
      bookmark.push(this.state.url)
      bookmark.push('')
      bookmark.push(Date.now())

      addBookmark(AddBookmarkURL, bookmark)
        .then(data => {
          this.props.newData(data)
          this.props.closeModal()
        })
        .catch(error => {})

      this.setState({
        title: '',
        url: '',
        nameError: false,
        urlError: false
      })
    }
  }

  titleChange = (e, value) => {
    this.setState({title: value, nameError: false})
  }

  urlChange = (e, value) => {
    this.setState({url: value, urlError: false})
  }

  close = () => {
    this.props.closeModal()
  }

  keyDown = event => {
    if (Object.is(event.key, 'Enter')) {
      this.saveBookmark()
    }
  }

  render() {
    const {t, open, classes} = this.props

    return (
      <Dialog maxWidth="xl" open={open} onClose={this.close}>
        <DialogTitle className={classes.dialogTitle}>
          <Typography style={{fontSize: 'x-large'}}>
            {t('newBookmark', {})}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Input
            className={classes.input}
            placeholder={t('title', {})}
            label={t('title', {})}
            value={this.state.title}
            error={this.state.nameError}
            onKeyDown={event => this.keyDown(event)}
            onChange={event => this.setState({title: event.target.value})}
          />
          <Input
            className={classes.input}
            placeholder={t('url', {})}
            label={t('url', {})}
            value={this.state.url}
            error={this.state.urlError}
            onKeyDown={event => this.keyDown(event)}
            onChange={event => this.setState({url: event.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{fontSize: 12}} color="secondary" onClick={this.saveBookmark}>
            {t('save', {})}
          </Button>
          <Button style={{fontSize: 12}} color="secondary" onClick={this.close}>
            {t('cancel', {})}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

NewBookmarkModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'NewBookmarkModal'})(
  translate('view', {wait: true})(NewBookmarkModal)
)
