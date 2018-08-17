import * as React from 'react'
import axios from 'axios'
import { InputGroup, FormControl, Button } from 'react-bootstrap'

import { signInWithGoogle } from '../firebase/auth'

import './App.css'

declare var BACKEND: string
declare var DOMAIN: string
declare var ORGANIZATION: string

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  displayMessage: false,
  title: '',
  message: '',
  github: '',
  user: {},
}
type State = Readonly<typeof initialState>

export class App extends React.Component<object, State> {
  readonly state: State = initialState

  async authenticate() {
    const { user, credential } = await signInWithGoogle()

    if (user.email.endsWith(`@${DOMAIN}`)) {
      this.setState({
        isAuthenticated: true,
        user: {
          displayName: user.displayName,
          email: user.email,
          ...credential,
        }
      })
    } else {
      this.setState({
        isLoading: false,
        isError: true,
        displayMessage: true,
        title: 'Error',
        message: `Please login with an account from ${DOMAIN}.`,
      })
    }
  }

  submitForm() {
    this.setState({ isLoading: true })

    axios.post(`${BACKEND}/invite/${this.state.github}`, this.state.user)
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          isError: false,
          displayMessage: true,
          title: 'Success!',
          message: 'You\'ve been successfully invited to the GitHub ' +
                   'organization. Please check your email for further ' +
                   `instructions or visit github.com/${ORGANIZATION}.`,
        })
      })
      .catch(({ response }) => {
        if (response.data && response.data.message) {
          this.setState({
            isLoading: false,
            isError: true,
            displayMessage: true,
            title: 'Error',
            message: response.data.message,
          })
        } else {
          this.setState({
            isLoading: false,
            isError: true,
            displayMessage: true,
            title: 'Error',
            message: 'An unexpected error occurred. Please try again later.',
          })
        }
      })
  }

  renderContent() {
    if (this.state.displayMessage) {
      return (
        <div className="inner">
          <h1>{this.state.title}</h1>
          <p>{this.state.message}</p>
          {this.state.isError &&
            <Button
              className="btn-primary invite-button"
              onClick={
                () => this.setState({
                  isAuthenticated: false,
                  displayMessage: false,
                })}>
              Try again
            </Button>
          }
        </div>
      )
    } else if (this.state.isAuthenticated) {
      return (
        <div className="inner">
          <h1>GitHub Account</h1>
          <h3>Enter your GitHub username.</h3>
          <InputGroup className="github-input">
            <InputGroup.Addon className="github-addon">@</InputGroup.Addon>
            <FormControl
              type="text"
              placeholder="andrewda"
              value={this.state.github}
              onChange={
                (event: any) => this.setState({ github: event.target.value })
              } />
          </InputGroup>
          <Button
            className="btn-primary invite-button"
            onClick={this.submitForm.bind(this)}>
            Send invite
          </Button>
        </div>
      )
    } else {
      return (
        <div className="inner">
          <h1>Authentication</h1>
          <h3>Sign in with {DOMAIN}.</h3>
          <Button
            className="btn-social btn-google google-button"
            onClick={this.authenticate.bind(this)}>
            <span className="fa fa-google"></span> Sign in with Google
          </Button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="app">
        <div
          className="overlay"
          style={{ display: this.state.isLoading ? 'grid' : 'none' }}>
          <div className="loader"></div>
        </div>
        <div className="panel">
          <div className="panel-content">
            {this.renderContent()}
          </div>
        </div>
      </div>
    )
  }
}
