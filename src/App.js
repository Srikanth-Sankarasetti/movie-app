import {Component} from 'react'

import {Switch, Route, Redirect} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import MovieContext from './context/MovieContext'
import Popular from './components/Popular'
import Search from './components/Search'
import Account from './components/Account'
import MovieItemDetails from './components/MovieItemDetails'
import NotFound from './components/NotFound'
import './App.css'

class App extends Component {
  state = {
    homeActive: true,
    popularActive: false,
  }

  changeHomeActiveStatus = () => {
    this.setState({
      homeActive: true,
      popularActive: false,
    })
  }

  changePopularActiveStatus = () => {
    this.setState({
      homeActive: false,
      popularActive: true,
    })
  }

  render() {
    const {homeActive, popularActive} = this.state
    return (
      <MovieContext.Provider
        value={{
          homeActive,
          popularActive,
          changeHomeActiveStatus: this.changeHomeActiveStatus,
          changePopularActiveStatus: this.changePopularActiveStatus,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/popular" component={Popular} />
          <ProtectedRoute exact path="/search" component={Search} />
          <ProtectedRoute exact path="/account" component={Account} />
          <ProtectedRoute
            exact
            path="/movies/:id"
            component={MovieItemDetails}
          />
          <Route exact path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </MovieContext.Provider>
    )
  }
}

export default App
