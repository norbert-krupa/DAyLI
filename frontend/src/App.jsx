import {React} from 'react'
import './App.css'
import Home from './components/Home'
import Groups from './components/Groups'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Register from './components/Register'
import {Routes, Route, useLocation} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoutes'
import Assistant from './components/Assistant'

function App() {
  const location = useLocation()
  const noNavbar = location.pathname === "/register" || location.pathname === "/"
  return (
    <>
      {
        noNavbar ?
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>

        </Routes>

        :

        <Navbar
          content={
            <Routes>
              <Route element={<ProtectedRoute/>}>
                <Route path="/home" element={<Home/>}/>
                <Route path="/groups" element={<Groups/>}/>
              </Route>
            </Routes>
        }
        />
      }
    </>
  )
}

export default App
