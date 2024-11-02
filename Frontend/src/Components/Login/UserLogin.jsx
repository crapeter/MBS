import React, { useState } from "react";
import { useAuth } from "../Misc/AuthContext";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import '../../CSS/UserLogin.css'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setIsLoggedIn, setIsAdmin, setUserEmail } = useAuth()
  const nav = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    let loggedIn = false

    await axios.post(`/api/users/login?email=${email}&password=${password}`)
    .then(res => {
      if (res.data) {
        setIsLoggedIn(true)
        setUserEmail(email)
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
        nav('/locations')
      })
      .catch(err => alert("Invalid email"))
    }
  }

  const register = () => {
    nav('/register')
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
          <div>
            <Button className="user_lr_buttons" variant="primary" onClick={handleLogin}>
              Log in
            </Button>
            <Button className="user_lr_buttons" variant="success" onClick={register}>
              Register
            </Button>
            <Button className="user_lr_buttons" variant="danger" onClick={() => nav('/')}>
              Return
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default UserLogin;