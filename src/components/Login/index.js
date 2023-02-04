import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isPasswordChecked: false,
    isError: false,
    errorMsg: '',
  }

  formSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSuccessSubmit(data.jwt_token)
    } else {
      this.onFailureSubmit(data.error_msg)
    }
  }

  onFailureSubmit = error => {
    this.setState({isError: true, errorMsg: error})
  }

  onSuccessSubmit = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    const {history} = this.props
    history.replace('/')
  }

  changeUsername = event => {
    this.setState({username: event.target.value})
  }

  changePassword = event => {
    this.setState({password: event.target.value})
  }

  checkPassword = event => {
    this.setState({isPasswordChecked: event.target.checked})
  }

  renderDesktopView = () => {
    const {
      username,
      password,
      isPasswordChecked,
      isError,
      errorMsg,
    } = this.state
    const passwordText = isPasswordChecked ? 'text' : 'password'
    return (
      <>
        <div className="loginMainContainer">
          <img
            className="movieImage"
            src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675173753/Group_7399_btlhcd.png"
            alt="login website logo"
          />

          <form className="formLoginContainer" onSubmit={this.formSubmit}>
            <h1 className="loginHead">Login</h1>
            <div className="usernameContainer">
              <label className="inputLabel" htmlFor="username">
                USERNAME
              </label>
              <input
                className="input"
                type="text"
                id="username"
                placeholder="username"
                value={username}
                onChange={this.changeUsername}
              />
            </div>
            <div className="usernameContainer1">
              <label className="inputLabel" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="input"
                type="password"
                id="password"
                placeholder="password"
                value={password}
                onChange={this.changePassword}
              />
            </div>
            {isError && <p className="error">{errorMsg}</p>}
            <button type="submit" className="Login-btn">
              Login
            </button>
          </form>
        </div>
      </>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return <>{this.renderDesktopView()}</>
  }
}

export default Login
