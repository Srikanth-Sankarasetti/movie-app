import React, {Component} from 'react'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FiAlertTriangle} from 'react-icons/fi'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const initialOriginalStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const initialTrendingStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    titleList: [],
    orginalList: [],
    trendingList: [],
    originalStatus: initialOriginalStatus.initial,
    trendingStatus: initialTrendingStatus.initial,
    settings: {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    },
  }

  componentDidMount() {
    this.getTrendingDetails()
    this.getDetails()
  }

  orginalTryAgainClicked = () => {
    this.getDetails()
  }

  getDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({originalStatus: initialOriginalStatus.progress})
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      'https://apis.ccbp.in/movies-app/originals',
      options,
    )
    const data = await response.json()
    const value = Math.floor(Math.random() * 10)
    if (response.ok === true) {
      const poster = data.results[value]
      const filterMainHeader = {
        backdropPath: poster.backdrop_path,
        overview: poster.overview,
        name: poster.title,
        id: poster.id,
      }
      const filterOrginalList = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        overview: each.overview,
        name: each.title,
        id: each.id,
        posterPath: each.poster_path,
      }))
      this.setState({
        titleList: filterMainHeader,
        orginalList: filterOrginalList,
        originalStatus: initialOriginalStatus.success,
      })
    }
    if (data.status_code === 400) {
      this.setState({originalStatus: initialOriginalStatus.failure})
    }
  }

  trendingTryAgainClicked = () => {
    this.getTrendingDetails()
  }

  getTrendingDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({trendingStatus: initialTrendingStatus.progress})
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      'https://apis.ccbp.in/movies-app/trending-movies',
      options,
    )
    const data = await response.json()
    if (response.ok === true) {
      const filterTrendingList = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        overview: each.overview,
        name: each.title,
        id: each.id,
        posterPath: each.poster_path,
      }))
      this.setState({
        trendingList: filterTrendingList,
        trendingStatus: initialTrendingStatus.success,
      })
    }
    if (data.status_code === 400) {
      this.setState({
        trendingStatus: initialTrendingStatus.failure,
      })
    }
  }

  renderTrendingList = () => {
    const {trendingList, settings} = this.state
    return (
      <>
        <Slider {...settings}>
          {trendingList.map(each => (
            <>
              <Link to={`/movies/${each.id}`} key={each.id}>
                <img
                  className="logo-image"
                  src={each.posterPath}
                  alt={each.name}
                />
              </Link>
            </>
          ))}
        </Slider>
      </>
    )
  }

  renderMovieHeader = () => {
    const {titleList} = this.state
    console.log(titleList)
    const {backdropPath, overview, name, id} = titleList
    return (
      <>
        <div
          style={{
            backgroundImage: `url(${backdropPath})`,
            backgroundSize: 'cover',
            height: '100vh',
            width: '100%',
          }}
        >
          <Header />
          <div className="super-man-container">
            <h1 className="super-man-head">{name}</h1>
            <h1 className="super-man-text">{overview}</h1>
            <Link to={`/movies/${id}`}>
              <button className="playButton" type="button">
                Play
              </button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  renderLoader = () => (
    <>
      <div className="loader">
        <Header />
        <div className="loader-container" testid="loader">
          <Loader type="TailSpin" color="#d81f26" width={50} height={50} />
        </div>
      </div>
    </>
  )

  renderOriginalDataOnStatus = () => {
    const {originalStatus} = this.state
    switch (originalStatus) {
      case initialOriginalStatus.progress:
        return this.renderLoader()
      case initialOriginalStatus.success:
        return this.renderMovieHeader()
      case initialOriginalStatus.failure:
        return this.renderMainOrginalErrorDetails()
      default:
        return null
    }
  }

  renderOriginalListOnStatus = () => {
    const {originalStatus} = this.state
    switch (originalStatus) {
      case initialOriginalStatus.progress:
        return this.renderNormalLoader()
      case initialOriginalStatus.success:
        return this.renderOrginalList()
      case initialOriginalStatus.failure:
        return this.rendorOriginalErrorDetails()
      default:
        return null
    }
  }

  renderTrendingListOnStatus = () => {
    const {trendingStatus} = this.state
    switch (trendingStatus) {
      case initialTrendingStatus.progress:
        return this.renderNormalLoader()
      case initialTrendingStatus.success:
        return this.renderTrendingList()
      case initialTrendingStatus.failure:
        return this.rendorTrendingErrorDetails()
      default:
        return null
    }
  }

  renderMainOrginalErrorDetails = () => (
    <div className="loader">
      <Header />
      <div className="loader-container">
        <FiAlertTriangle color="#D81F26" size={30} />
        <p className="error-message">Something went wrong. Please try again</p>
        <button
          type="button"
          className="try-again-button"
          onClick={this.orginalTryAgainClicked}
        >
          Try Again
        </button>
      </div>
    </div>
  )

  rendorOriginalErrorDetails = () => (
    <div className="normal-loader-container">
      <FiAlertTriangle color="#D81F26" size={30} />
      <p className="error-message">Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-again-button"
        onClick={this.orginalTryAgainClicked}
      >
        Try Again
      </button>
    </div>
  )

  rendorTrendingErrorDetails = () => (
    <div className="normal-loader-container">
      <FiAlertTriangle color="#D81F26" size={30} />
      <p className="error-message">Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-again-button"
        onClick={this.trendingTryAgainClicked}
      >
        Try Again
      </button>
    </div>
  )

  renderNormalLoader = () => (
    <div className="normal-loader-container" testid="loader">
      <Loader type="TailSpin" color="#d81f26" width={50} height={50} />
    </div>
  )

  renderOrginalList = () => {
    const {orginalList, settings} = this.state

    return (
      <>
        <Slider {...settings}>
          {orginalList.map(each => (
            <>
              <Link to={`/movies/${each.id}`} key={each.id}>
                <img
                  className="logo-image"
                  src={each.posterPath}
                  alt={each.name}
                />
              </Link>
            </>
          ))}
        </Slider>
      </>
    )
  }

  render() {
    return (
      <>
        <div className="homeMainContainer">
          {this.renderOriginalDataOnStatus()}
          <div className="home-movie-list-container">
            <div className="slick-container">
              <h1 className="originalHead">Trending Now</h1>
              {this.renderTrendingListOnStatus()}
              <h1 className="originalHead">Originals</h1>
              {this.renderOriginalListOnStatus()}
            </div>
            <div>
              <Footer />
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Home
