import React from 'react'

const MoiveContext = React.createContext({
  homeActive: true,
  popularActive: false,
  changeHomeActiveStatus: () => {},
  changePopularActiveStatus: () => {},
})

export default MoiveContext
