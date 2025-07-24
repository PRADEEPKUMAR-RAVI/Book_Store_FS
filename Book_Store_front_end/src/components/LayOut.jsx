import React from 'react'
import { Outlet } from 'react-router'
import NavBar from './NavBar'

const LayOut = () => {
  return (

    <div>
        <NavBar/>
        <Outlet/>
    </div>
  )
}

export default LayOut;