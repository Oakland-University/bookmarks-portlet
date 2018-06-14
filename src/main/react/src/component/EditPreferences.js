import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import {Typography, TextField, Button} from 'material-ui'
import {savePreferences} from '../utils/fetchEditData.js'
import {translate} from 'react-i18next'

/* global SavePreferencesURL */

class EditPreferences extends Component {
  constructor() {
    super()

    this.state = {
      pageItems: null,
      error: false,
      invalid: false
    }
  }

  componentDidMount() {
    if (!Object.is(this.props.preferences, null)) {
      this.setState({pageItems: this.props.preferences.itemsPerPage})
    }
    document.getElementById('prefs').focus()
  }

  savePrefs = () => {
    if (Object.is(parseInt(this.state.pageItems, 10), undefined)) {
      this.setState({invalid: true})
    } else if (parseInt(this.state.pageItems, 10) > 50) {
      this.setState({invalid: true})
    } else if (parseInt(this.state.pageItems, 10) < 1) {
      this.setState({invalid: true})
    } else if (isNaN(parseInt(this.state.pageItems, 10))) {
      this.setState({invalid: true})
    } else {
      this.setState({invalid: false})
      savePreferences(SavePreferencesURL, this.state.pageItems)
        .then(prefs => {
          this.props.changePrefs({itemsPerPage: this.state.pageItems})
        })
        .catch(err => {
          this.setState({error: true})
        })
    }
  }

  backToMain = data => {
    this.setState({pageItems: null})
    this.props.closePrefs()
  }

  getPrefContent(t) {
    const content = {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 0,
      marginLeft: 5
    }

    return (
      <CardContent style={content}>
        <Typography tabIndex="0" style={{marginRight: 10}} variant="display">
          {t('bookmarkPref', {})}
        </Typography>
        <TextField
          value={this.state.pageItems}
          style={{marginRight: 15}}
          onChange={event => this.setState({pageItems: event.target.value})}
        />
      </CardContent>
    )
  }

  getErrorLabel(t) {
    if (this.state.invalid) {
      return (
        <Typography
          style={{
            paddingLeft: 0,
            paddingTop: 10,
            marginLeft: 5,
            color: 'red'
          }}
          tabIndex="0"
          variant="title"
        >
          {t('preferenceError', {})}
        </Typography>
      )
    } else {
      return <div />
    }
  }

  render() {
    const {t} = this.props

    return (
      <Card style={{paddingLeft: 15}}>
        <CardContent style={{paddingLeft: 0}}>
          <Typography
            id="prefs"
            tabIndex="0"
            style={{paddingLeft: 0, marginLeft: 5}}
            variant="title"
          >
            {t('preferences', {})}
          </Typography>
        </CardContent>
        {this.getPrefContent(t)}
        {this.getErrorLabel(t)}
        <CardActions style={{paddingLeft: 0}}>
          <Button 
            tabIndex="0" 
            style={{fontSize: 12}} 
            color="secondary" 
            onClick={this.savePrefs}
          >
            {t('save', {})}
          </Button>
          <Button 
            tabIndex="0" 
            style={{fontSize: 12}} 
            color="secondary" 
            onClick={this.backToMain}
          >
            {t('cancel', {})}
          </Button>
        </CardActions>
      </Card>
    )
  }
}

export default translate('view', {wait: true})(EditPreferences)
