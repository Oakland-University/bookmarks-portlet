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
  input: {
    fontSize: 12,
    display: 'flex',
    marginTop: '1em',
    marginBottom: '1em'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1em'
  }
})

class EditFolderModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newTitle: '',
      error: false
    }
  }

  componentDidMount() {
    let ntitle = this.props.title
    this.setState({
      newTitle: ntitle
    })
  }

  handleSave = () => {
    if (this.state.newTitle.length > 0) {
      this.props.editFolder(this.state.newTitle)
    } else {
      this.setState({error: true})
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
    const {t, classes, open, title} = this.props

    return (
      <Dialog maxWidth="lg" open={open} onClose={this.handleClose}>
        <DialogTitle className={classes.dialogTitle}>
          <Typography style={{fontSize: 'x-large'}}>
            {t('edit', {})}
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <label style={{fontSize: 'inherit'}}>
            {t('title', {})}
          </label>
          <Input
            className={classes.input}
            error={this.state.error}
            onKeyDown={event => this.keyDown(event)}
            onChange={event =>
              this.setState({newTitle: event.target.value, error: false})}
            defaultValue={title}
          />
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

EditFolderModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'EditFolderModal'})(
  translate('view', {wait: true})(EditFolderModal)
)
