import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Jobs from './pages/Jobs.jsx'
import JobDetails from './pages/JobDetails.jsx'
import SavedJobs from './pages/SavedJobs.jsx'
import Dashboard from './pages/Dashboard.jsx'
import About from './pages/About.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import MyApplications from './pages/MyApplications.jsx'
import Navbar from './components/Navbar.jsx'

export default function App(){
  return(
    <>
      <Navbar />
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/jobs' element={<Jobs/>}/>
      <Route path='/saved-jobs' element={<ProtectedRoute><SavedJobs/></ProtectedRoute>}/>
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path='/applications' element={<ProtectedRoute><MyApplications/></ProtectedRoute>}/>
      <Route path='/admin' element={<ProtectedRoute role='admin'><AdminDashboard/></ProtectedRoute>}/>
      <Route path='*' element={<Home/>}/>
      </Routes>
    </>
  )
}