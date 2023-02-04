import {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'

import MovieContext from '../../context/MovieContext'

import './index.css'

class Header extends Component {
  searchClicked = () => {
    const {history} = this.props
    history.replace('/search')
  }

  render() {
    return (
      <MovieContext.Consumer>
        {value => {
          const {
            homeActive,
            popularActive,
            changeHomeActiveStatus,
            changePopularActiveStatus,
          } = value
          const homeStatus = homeActive ? 'homeActiveColor' : ''
          const popularStatus = popularActive ? 'homeActiveColor' : ''

          const changeHome = () => {
            changeHomeActiveStatus()
          }
          const changePopular = () => {
            changePopularActiveStatus()
          }
          return (
            <div className="headerMainContainer">
              <div className="headerContainer">
                <Link to="/">
                  <img
                    className="websiteLogo"
                    src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675173753/Group_7399_btlhcd.png"
                    alt="website logo"
                  />
                </Link>
                <nav className="navList">
                  <li className="listItem">
                    <Link
                      to="/"
                      className={`link ${homeStatus} `}
                      onClick={changeHome}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="listItem">
                    <Link
                      to="/popular"
                      className={`link ${popularStatus} `}
                      onClick={changePopular}
                    >
                      Popular
                    </Link>
                  </li>
                </nav>
              </div>
              <div className="search_and_profile_container">
                <div>
                  <button
                    type="button"
                    className="searchButton"
                    onClick={this.searchClicked}
                  >
                    <HiOutlineSearch size={25} color="#ffffff" />
                  </button>
                </div>
                <Link to="/account">
                  <img
                    className="profile"
                    src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675189771/Avatar_bj1bi3.png"
                    alt="profile"
                  />
                </Link>
              </div>
            </div>
          )
        }}
      </MovieContext.Consumer>
    )
  }
}

export default withRouter(Header)
