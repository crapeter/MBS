import React, { useState } from "react";
import { useAuth } from "../Misc/AuthContext";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import '../../CSS/UserLogin.css'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setIsLoggedIn, setIsAdmin } = useAuth()
  const nav = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    let loggedIn = false

    await axios.post(`/api/users/login?email=${email}&password=${password}`)
    .then(res => {
      if (res.data) {
        setIsLoggedIn(true)
        loggedIn = true
      } else {
        setIsLoggedIn(false)
        alert("Invalid email or password")
      }
    })
    .catch(err => alert("Invalid email or password"))

    if (loggedIn) {
      await axios.get(`/api/users/is/admin?email=${email}`)
      .then(res => {
        if (res.data)
          setIsAdmin(true)
        else
          setIsAdmin(false)
        nav('/movies')
      })
      .catch(err => alert("Invalid email"))
    }
  }

  return (
    <div className = "top_login_div">
      <div className="user_login">
        <h2 className="login_text">Login</h2>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              className="login_input"
              type="text"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Control
              className="login_input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleLogin}>
            Log in
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default UserLogin;