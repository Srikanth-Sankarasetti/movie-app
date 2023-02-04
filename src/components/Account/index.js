import {Component} from 'react'
import Cookies from 'js-cookie'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

class Account extends Component {
  logoutAccount = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    return (
      <div className="account-main-container">
        <Header />
        <div className="account-details-container">
          <div className="account-details">
            <h1 className="account-head">Account</h1>
            <hr className="hori" />
            <div className="membership-container">
              <p className="member-para">Member ship</p>
              <div>
                <p className="gmail">rahul@gmail.com</p>
                <p className="account-password">Password: *********</p>
              </div>
            </div>
            <hr className="hori" />
            <div className="plan-container">
              <p className="plan-Details-para">Plan Details</p>
              <div className="premium-container">
                <p className="premium-para">Premium</p>
                <p className="ultra-para">Ultra HD</p>
              </div>
            </div>
            <hr className="hori" />
          </div>
          <button
            type="button"
            className="logout-button"
            onClick={this.logoutAccount}
          >
            Logout
          </button>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Account
