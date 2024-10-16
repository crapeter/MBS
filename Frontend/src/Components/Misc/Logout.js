import React from 'react'
import { Button } from 'react-bootstrap'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import '../../CSS/Logout.css'

const Logout = () => {
  const { setIsLoggedIn, setIsAdmin, setUserEmail } = useAuth()
  const nav = useNavigate()

  const logout = () => {
    setIsLoggedIn(false)
    setIsAdmin(false)
    setUserEmail('')
    nav('/')
  }

  return (
    <div>
      <Button className='logout_button' variant='danger' onClick={logout}>Logout</Button>
    </div>
  )
}

export default Logout