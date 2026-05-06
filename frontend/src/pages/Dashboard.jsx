
import React from 'react'
import Navbar from '../components/Navbar'

export default function Dashboard(){
  return(
    <div>
      <Navbar/>
      <div className='container'>
        <h2>Dashboard</h2>
        <p>Welcome user</p>
      </div>
    </div>
  )
}
