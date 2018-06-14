import React, {Component} from 'react'
import Dialog, {DialogTitle, DialogActions} from 'material-ui/Dialog'
import {Typography, Button} from 'material-ui'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {translate} from 'react-i18next'
import {red} from 'material-ui/colors'

const styles = {
  button: {
    color: red[500],
    fontSize: 12
  },
  dialogTitle: {
    backgroundColor: red[500],
    color: '#ffffff'
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bolder',
    fontSize: 'medium'
  }
}

class DeleteFolderModal extends Component {
  handleCancel = () => {
    this.props.closeDelete()
  }

  handleDelete = () => {
    this.props.deleteFolder()
  }

  render() {
    const {t, classes, open} = this.props

    return (
      <Dialog maxWidth="lg" open={open} onClose={this.handleCancel}>
        <DialogTitle className={classes.dialogTitle}>
          <Typography className={classes.text}>
            {t('deleteFolderConfirm', {})}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button className={classes.button} onClick={this.handleDelete}>
            {t('delete', {})}
          </Button>
          <Button className={classes.button} onClick={this.handleCancel}>
            {t('cancel', {})}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

DeleteFolderModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'DeleteFolderModal'})(
  translate('view', {wait: true})(DeleteFolderModal)
)
