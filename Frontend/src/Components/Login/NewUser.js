import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import '../../CSS/NewUser.css'

const NewUser = () => {
  const isAdmin = false
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [cardNumber, setCardNumber] = useState('')

  const nav = useNavigate()

  const handleRegistation = async () => {
    await axios.post(`/api/users/new/user`, {
      isAdmin: isAdmin,
      name: name,
      email: email,
      password: password,
      phoneNum: phoneNumber,
      address: address,
      cardNum: cardNumber
    })
    .then(res => {
      if (res.data) {
        alert("Registration successful")
        nav('/')
      } else {
        alert(res.data)
      }
    })
    .catch(err => alert(err.message))
  }

  const goBack = () => {
    nav('/')
  }

  return (
    <div className="top_register_div">
      <div className="register">
        <h2 className="register_text">Register</h2>
        <Form>
          <Form.Group controlId="formBasicName">
            <Form.Control
              className="register_input"
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              requried
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Control
              className="register_input"
              type="text"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              requried
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control
              className="register_input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              requried
            />
          </Form.Group>

          <Form.Group controlId="formBasicPhoneNumber">
            <Form.Control
              className="register_input"
              type="text"
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              requried
            />
          </Form.Group>

          <Form.Group controlId="formBasicAddress">
            <Form.Control
              className="register_input"
              type="text"
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
              requried
            />
          </Form.Group>

          <Form.Group controlId="formBasicCardNumber">
            <Form.Control
              className="register_input"
              type="text"
              placeholder="Card Number"
              onChange={(e) => setCardNumber(e.target.value)}
              requried
            />
          </Form.Group>
        </Form>
        <div>
          <Button className="register_buttons" variant="primary" onClick={handleRegistation}>Register</Button>
          <Button className="register_buttons" variant="success" onClick={goBack}>Return</Button>
        </div>
      </div>
    </div>
  )
}

export default NewUser