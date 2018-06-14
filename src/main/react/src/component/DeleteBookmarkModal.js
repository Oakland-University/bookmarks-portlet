import React, {Component} from 'react'
import Dialog, {DialogActions, DialogTitle} from 'material-ui/Dialog'
import PropTypes from 'prop-types'
import {Typography, Button} from 'material-ui'
import {withStyles} from 'material-ui/styles'
import {translate} from 'react-i18next'
import {red} from 'material-ui/colors'

const styles = {
  button: {
    color: red[500],
    fontSize: 12
  },
  dialogTitle: {
    backgroundColor: red[500]
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bolder',
    fontSize: 'medium'
  }
}

class DeleteBookmarkModal extends Component {
  cancel = () => {
    this.props.closeDelete()
  }

  deleteItem = () => {
    this.props.deleteBookmark()
    this.props.closeDelete()
  }

  render() {
    const {t, classes} = this.props

    return (
      <Dialog
        maxWidth="lg"
        open={this.props.open}
        onClose={this.handleCancel}
      >
        <DialogTitle className={classes.dialogTitle}>
          <Typography className={classes.text}>
            {t('deleteBookmarkConfirm', {})}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button className={classes.button} onClick={this.deleteItem}>
            {t('delete', {})}
          </Button>
          <Button className={classes.button} onClick={this.cancel}>
            {t('cancel', {})}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

DeleteBookmarkModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'DeleteBookmarkModal'})(
  translate('view', {wait: true})(DeleteBookmarkModal)
)
