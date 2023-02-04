import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const intialPopularStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Popular extends Component {
  state = {
    popularVideoList: [],
    popularStatus: intialPopularStatus.initial,
  }

  componentDidMount() {
    this.getPopularDetails()
  }

  reloadPopularDetails = () => {
    this.getPopularDetails()
  }

  getPopularDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({popularStatus: intialPopularStatus.progress})
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      'https://apis.ccbp.in/movies-app/popular-movies',
      options,
    )
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const filterPopularVideos = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        title: each.title,
        id: each.id,
        posterPath: each.poster_path,
      }))
      this.setState({
        popularVideoList: filterPopularVideos,
        popularStatus: intialPopularStatus.success,
      })
    }
    if (data.status_code === 400) {
      this.setState({popularStatus: intialPopularStatus.failure})
    }
  }

  renderPopularVideoFailure = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675357761/Background-Complete_l4q3h3.png"
        alt="failure view"
      />
      <p className="failure-para">Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-again-button"
        onClick={this.reloadPopularDetails}
      >
        Try Again
      </button>
    </div>
  )

  renderPopularLoader = () => (
    <div testid="loader">
      <Loader type="TailSpin" color="#d81f26" width={50} height={50} />
    </div>
  )

  renderPopularVideos = () => {
    const {popularVideoList} = this.state
    return (
      <>
        {popularVideoList.map(each => (
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
        <div>
          <Footer />
        </div>
      </>
    )
  }

  renderPopularRouteOnStatus = () => {
    const {popularStatus} = this.state
    switch (popularStatus) {
      case intialPopularStatus.progress:
        return this.renderPopularLoader()
      case intialPopularStatus.success:
        return this.renderPopularVideos()
      case intialPopularStatus.failure:
        return this.renderPopularVideoFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="popularMainContainer">
        <Header />
        <div className="subContainer">{this.renderPopularRouteOnStatus()}</div>
      </div>
    )
  }
}

export default Popular
