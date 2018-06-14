import React, {Component} from 'react'
import {Typography, Button} from 'material-ui'
import HardwareKeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import HardwareKeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import {translate} from 'react-i18next'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'

const styles = theme => ({
  div: {
    marginTop: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    fontSize: 'inherit'
  }
})

class BottomPanel extends Component {
  handlePrevious = () => {
    this.props.prevPageClick()
  }

  handleNext = () => {
    this.props.nextPageClick()
  }

  getPageNum(t) {
    const page = t('page', {}) + ' ' + this.props.page

    return page
  }

  render() {
    const {t, classes} = this.props

    return (
      <div className={classes.div}>
        <Button
          tabIndex="0"
          aria-label={t('previousPage', {})}
          onClick={this.handlePrevious}
        >
          <HardwareKeyboardArrowLeft />
        </Button>
        <Typography variant="body2" className={classes.label}>
          {this.getPageNum(t)}
        </Typography>
        <Button
          tabIndex="0"
          aria-label={t('nextPage', {})}
          onClick={this.handleNext}
        >
          <HardwareKeyboardArrowRight />
        </Button>
      </div>
    )
  }
}

BottomPanel.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, {name: 'BottomPanel'})(
  translate('view', {wait: true})(BottomPanel)
)
