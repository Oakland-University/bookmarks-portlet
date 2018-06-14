import React, {Component} from 'react'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import {Button, Typography, Input} from 'material-ui'
import {translate} from 'react-i18next'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'

const styles = theme => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary[400],
    paddingRight: 200
  },
  text: {
    fontSize: 'x-large'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1em'
  },
  input: {
    fontSize: 12,
    display: 'flex',
    marginTop: '1em',
    marginBottom: '1em'
  }
})

class EditBookmarkModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newTitle: '',
      newUrl: '',
      nameError: false,
      urlError: false
    }
  }

  componentDidMount() {
    this.setState({
      newTitle: this.props.title,
      newUrl: this.props.url
    })
  }

  handleSave = () => {
    const bookmark = []

    if (Object.is(this.state.newTitle.length, 0)) {
      this.setState({error: true})
    } else if (Object.is(this.state.newUrl.length, 0)) {
      this.setState({error: true})
    } else {
      bookmark.push(this.state.newUrl)
      bookmark.push(this.state.newTitle)
      bookmark.push('')
      this.props.editBookmark(bookmark)
      this.handleClose()
    }
  }

  handleClose = () => {
    this.props.closeEdit()
  }

  keyDown = event => {
    if (Object.is(event.key, 'Enter')) {
      this.handleSave()
    }
  }

  render() {
    const {t, classes} = this.props

    return (
      <Dialog
        maxWidth="lg"
        open={this.props.open}
        onClose={this.handleClose}
      >
        <DialogTitle className={classes.dialogTitle}>
          <Typography className={classes.text}>
            {t('edit', {})}
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <label style={{fontSize: 'large'}}>
            {t('title', {})}
          </label>
          <Input
            error={this.state.nameError}
            className={classes.input}
            onKeyDown={event => this.keyDown(event)}
            onChange={event =>
              this.setState({newTitle: event.target.value, error: false})}
            defaultValue={this.props.title}
          />
          <br />
          <label>
            {t('url', {})}
          </label>
          <Input
            error={this.state.urlError}
            className={classes.input}
            onKeyDown={event => this.keyDown(event)}
            onChange={event =>
              this.setState({newUrl: event.target.value, error: false})}
            defaultValue={this.props.url}
          />
          <br />
        </DialogContent>
        <DialogActions>
          <Button style={{fontSize: 12}} color="secondary" onClick={this.handleSave}>
            {t('save', {})}
          </Button>
          <Button style={{fontSize: 12}} color="secondary" onClick={this.handleClose}>
            {t('cancel', {})}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

EditBookmarkModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'EditBookmarkModal'})(
  translate('view', {wait: true})(EditBookmarkModal)
)
