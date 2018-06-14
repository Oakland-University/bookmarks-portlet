import React, {Component} from 'react'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import Radio, {RadioGroup} from 'material-ui/Radio'
import {FormControlLabel} from 'material-ui/Form'
import {translate} from 'react-i18next'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'

const styles = theme => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary[400]
  },
  text: {
    fontWeight: 'bolder',
    fontSize: 'medium'
  }
})

class AddToFolderModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: undefined
    }
  }

  saveChange = () => {
    if (!Object.is(this.state.selected, undefined)) {
      this.props.addToFolder(this.state.selected)
    }

    this.props.closeAddToFolder()
  }

  closeModal = () => {
    this.props.closeAddToFolder()
  }

  changeSelected = (event, value) => {
    this.setState({selected: value})
  }

  onClick(event, value) {
    this.onChange(event, value)
  }

  getFormLabel(text) {
    return (
      <Typography style={{fontSize: 'medium'}}>
        {text}
      </Typography>
    )
  }

  getOptions() {
    const options = []
    for (let i = 0; i < this.props.folders.length; i++) {
      options.push(
        <FormControlLabel
          value={this.props.folders[i]}
          label={this.getFormLabel(this.props.folders[i])}
          control={<Radio color="primary"/>}
        />
      )
    }

    return options
  }

  render() {
    const {t, classes, open} = this.props

    return (
      <Dialog maxWidth="lg" open={open} onClose={this.closeModal}>
        <DialogTitle className={classes.dialogTitle}>
          <Typography className={classes.text}>
            {t('addToFolder', {})}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <RadioGroup
            aria-label={t('folders', {})}
            value={this.state.selected}
            onChange={this.changeSelected}
          >
            {this.getOptions()}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.saveChange}>
            {t('save', {})}
          </Button>
          <Button color="secondary" onClick={this.closeModal}>
            {t('cancel', {})}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

AddToFolderModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'AddToFolderModal'})(
  translate('view', {wait: true})(AddToFolderModal)
)
