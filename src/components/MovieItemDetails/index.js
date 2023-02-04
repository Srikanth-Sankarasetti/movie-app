import {Component} from 'react'
import Cookies from 'js-cookie'
import {format} from 'date-fns'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const initialMovieDetailsStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MovieItemDetails extends Component {
  state = {
    movieDetailsList: [],
    similarMovies: [],
    genresList: [],
    spokenLanguageList: [],
    movieDetailsStatus: initialMovieDetailsStatus.initial,
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  tryAgainClicked = () => {
    this.getMovieDetails()
  }

  getMovieDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({movieDetailsStatus: initialMovieDetailsStatus.progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      `https://apis.ccbp.in/movies-app/movies/${id}`,
      options,
    )
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const filterSimilarMovies = data.movie_details.similar_movies.map(
        each => ({
          backdropPath: each.backdrop_path,
          title: each.title,
          id: each.id,
          posterPath: each.poster_path,
        }),
      )
      const filterMovieList = data.movie_details.genres.map(each => ({
        id: each.id,
        name: each.name,
      }))
      const movieDetails = data.movie_details
      const runtimeHours = Math.floor(movieDetails.runtime / 60)
      const mints = movieDetails.runtime - runtimeHours * 60
      const filterMovieDetails = {
        adult: movieDetails.adult,
        backdropPath: movieDetails.backdrop_path,
        budget: movieDetails.budget,
        id: movieDetails.id,
        overview: movieDetails.overview,
        posterPath: movieDetails.poster_path,
        releaseDate: format(
          new Date(movieDetails.release_date),
          'do MMMM yyyy',
        ),
        runtime: `${runtimeHours}h ${mints}m`,
        year: format(new Date(movieDetails.release_date), 'yyyy'),
        title: movieDetails.title,
        ratingCount: movieDetails.vote_average,
        ratingAverage: movieDetails.vote_count,
      }
      const filterSpokenLanguage = movieDetails.spoken_languages.map(each => ({
        englishName: each.english_name,
        id: each.id,
      }))

      this.setState({
        similarMovies: filterSimilarMovies,
        genresList: filterMovieList,
        movieDetailsList: filterMovieDetails,
        spokenLanguageList: filterSpokenLanguage,
        movieDetailsStatus: initialMovieDetailsStatus.success,
      })
    } else {
      this.setState({
        movieDetailsStatus: initialMovieDetailsStatus.failure,
      })
    }
  }

  renderMovieDetailsHeader = () => {
    const {
      movieDetailsList,
      genresList,
      spokenLanguageList,
      similarMovies,
    } = this.state
    const {
      adult,
      backdropPath,
      title,
      overview,
      year,
      runtime,
      ratingAverage,
      ratingCount,
      budget,
      releaseDate,
    } = movieDetailsList
    return (
      <>
        <div
          style={{
            backgroundImage: `url(${backdropPath})`,
            backgroundSize: 'cover',
            height: '93vh',
            width: '100%',
          }}
        >
          <Header />
          <div className="movie-details-head-container">
            <h1 className="movie-head">{title}</h1>
            <div className="runtime-container">
              <p className="runtime">{runtime}</p>
              <p className="adult">{adult ? 'A' : 'U/A'}</p>
              <p className="runtime">{year}</p>
            </div>
            <p className="overview">{overview}</p>
            <button className="movie-details-play" type="button">
              Play
            </button>
          </div>
        </div>
        <div className="movie-details-subContainer">
          <div className="budget-details">
            <div>
              <h1 className="genres">Genres</h1>
              <ul>
                {genresList.map(each => (
                  <li key={each.id} className="genres-name">
                    <p>{each.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <ul>
              <h1 className="genres">Audio Available</h1>
              <div>
                {spokenLanguageList.map(each => (
                  <li key={each.id} className="genres-name">
                    <p>{each.englishName}</p>
                  </li>
                ))}
              </div>
            </ul>
            <div>
              <h1 className="genres">Rating Count</h1>
              <p className="rating">{ratingAverage}</p>
              <h1 className="genres">Rating Average</h1>
              <p className="rating">{ratingCount}</p>
            </div>
            <div>
              <h1 className="genres">Budget</h1>
              <p className="rating">{budget}</p>
              <h1 className="genres">Release Date</h1>
              <p className="rating">{releaseDate}</p>
            </div>
          </div>
          <h1 className="more">More like this</h1>
          <ul className="more-Container">
            {similarMovies.map(each => (
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
          </ul>
          <Footer />
        </div>
      </>
    )
  }

  renderMovieDetailsLoader = () => (
    <div className="movie-details-loader">
      <Header />
      <div className="movie-details-loader-container" testid="loader">
        <Loader type="TailSpin" color="#d81f26" width={50} height={50} />
      </div>
    </div>
  )

  renderMovieDetailsFailure = () => (
    <div className="movie-details-failure">
      <img
        className="movie-failure-image"
        src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675357761/Background-Complete_l4q3h3.png"
        alt="failure view"
      />
      <p className="some">Something went wrong. Please try again</p>
      <button
        className="movie-try"
        type="button"
        onClick={this.tryAgainClicked}
      >
        Try Again
      </button>
    </div>
  )

  renderMovieDetailsOnStatus = () => {
    const {movieDetailsStatus} = this.state
    switch (movieDetailsStatus) {
      case initialMovieDetailsStatus.progress:
        return this.renderMovieDetailsLoader()
      case initialMovieDetailsStatus.success:
        return this.renderMovieDetailsHeader()
      case initialMovieDetailsStatus.failure:
        return this.renderMovieDetailsFailure()
      default:
        return null
    }
  }

  render() {
    const {movieDetailsList} = this.state
    console.log(movieDetailsList)
    return <div>{this.renderMovieDetailsOnStatus()}</div>
  }
}

export default MovieItemDetails
