import React, {Component} from 'react'
import {Button, Input} from 'material-ui'
import Dialog, {
  DialogContent,
  DialogActions,
  DialogTitle
} from 'material-ui/Dialog'
import {translate} from 'react-i18next'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import {withStyles} from 'material-ui/styles'
import {addFolder} from '../utils/fetchBookmarkData.js'

const styles = theme => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary[400],
    paddingRight: 200
  },

  content: {
    marginTop: '1em'
  },

  input: {
    fontSize: 15,
    display: 'flex',
    marginTop: '1em',
    marginBottom: '1em'
  }
})

/* global AddFolderURL */

class NewFolderModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      titleError: false
    }
  }

  saveFolder = () => {
    if (
      !Object.is(this.state.title.length, 0) &&
      !Object.is(this.state.title, undefined)
    ) {
      addFolder(AddFolderURL, this.state.title)
        .then(data => {
          this.props.newData(data)
          this.props.closeModal()
          this.setState({titleError: false, title: ''})
        })
        .catch(error => {
          this.props.setError()
          this.props.closeModal()
        })
    } else {
      this.setState({titleError: true})
    }
  }

  close = () => {
    this.props.closeModal()
  }

  keyDown = event => {
    if (Object.is(event.key, 'Enter')) {
      this.saveFolder()
    }
  }

  render() {
    const {t, classes, open} = this.props

    return (
      <div>
        <Dialog maxWidth="xl" open={open} onClose={this.close}>
          <DialogTitle className={classes.dialogTitle}>
            <Typography style={{fontSize: 'x-large'}}>
              {t('newFolder', {})}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Input
              className={classes.input}
              placeholder={t('title', {})}
              value={this.state.title}
              error={this.state.titleError}
              style={{display: 'flex'}}
              onKeyDown={event => this.keyDown(event)}
              onChange={event => this.setState({title: event.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              style={{margin: 5, fontSize: 12}}
              onClick={this.saveFolder}
            >
              {t('save', {})}
            </Button>
            <Button
              color="secondary"
              style={{margin: 5, fontSize: 12}}
              onClick={this.close}
            >
              {t('cancel', {})}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

NewFolderModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'NewFolderModal'})(
  translate('view', {wait: true})(NewFolderModal)
)
