import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import Loader from 'react-loader-spinner'

import MovieContext from '../../context/MovieContext'

import './index.css'

const initialSearchStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Search extends Component {
  state = {
    inputValue: '',
    searchValue: '',
    searchList: [],
    searchStatus: initialSearchStatus.initial,
  }

  changeInputValue = event => {
    this.setState({inputValue: event.target.value})
  }

  searchClicked = () => {
    const {inputValue} = this.state
    this.setState({searchValue: inputValue})
    if (inputValue !== '') {
      this.getSearchDetails()
    } else {
      this.setState({searchStatus: initialSearchStatus.initial})
    }
  }

  getSearchDetails = async () => {
    const {inputValue} = this.state
    this.setState({searchStatus: initialSearchStatus.progress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      `https://apis.ccbp.in/movies-app/movies-search?search=${inputValue}`,
      options,
    )
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const filterSearchList = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        title: each.title,
        id: each.id,
        posterPath: each.poster_path,
      }))
      this.setState({
        searchList: filterSearchList,
        searchStatus: initialSearchStatus.success,
      })
    }
    if (data.results.length === 0) {
      this.setState({searchStatus: initialSearchStatus.failure})
    }
  }

  renderSearchHeader = () => {
    const {inputValue} = this.state
    return (
      <>
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
                <Link to="/" className="link">
                  Home
                </Link>
              </li>
              <li className="listItem">
                <Link to="/popular" className="link">
                  Popular
                </Link>
              </li>
            </nav>
          </div>
          <div className="search_and_profile_container2">
            <div className="search-Container">
              <input
                className="input-search"
                type="search"
                placeholder="Search"
                value={inputValue}
                onChange={this.changeInputValue}
              />
              <button
                type="button"
                className="searchButton2"
                onClick={this.searchClicked}
                testid="searchButton"
              >
                <HiOutlineSearch size={10} color="#ffffff" />
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
      </>
    )
  }

  renderSearchVideos = () => {
    const {searchList} = this.state
    return (
      <>
        {searchList.map(each => (
          <li className="popularPosterContainer" key={each.id}>
            <Link to={`/movies/${each.id}`}>
              <img
                className="popularImage"
                src={each.posterPath}
                alt={each.title}
              />
            </Link>
          </li>
        ))}
      </>
    )
  }

  renderSearchLoader = () => (
    <div className="search-loader-container" testid="loader">
      <Loader type="TailSpin" color="#d81f26" width={50} height={50} />
    </div>
  )

  renderEmptyResult = () => {
    const {searchValue} = this.state
    return (
      <div className="empty-container">
        <img
          className="no-video-image"
          src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675364948/Group_7394_o5vlfg.png"
          alt="no movies"
        />
        <p className="search-para">
          Your search for {searchValue} did not find any matches.
        </p>
      </div>
    )
  }

  renderSearchListOnStatus = () => {
    const {searchStatus} = this.state
    switch (searchStatus) {
      case initialSearchStatus.progress:
        return this.renderSearchLoader()
      case initialSearchStatus.success:
        return this.renderSearchVideos()
      case initialSearchStatus.failure:
        return this.renderEmptyResult()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="search-main-container">
        {this.renderSearchHeader()}
        <div className="subContainer2">{this.renderSearchListOnStatus()}</div>
      </div>
    )
  }
}

export default Search
