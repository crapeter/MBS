import React, { useState } from "react"
import { Modal, Button, Form } from 'react-bootstrap'
import axios from "axios"
import '../../CSS/PurchaseTickets.css'

const PurchaseTickets = ({ movie, location }) => {
  const [show, setShow] = useState(false)
  const [theaters, setTheaters] = useState([])
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [selectedTheater, setSelectedTheater] = useState('')
  const [paymentType, setPaymentType] = useState([])
  const [payment, setPayment] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
    getTheaters()
    setPayments()
  }

  const increment = () => {
    if (ticketQuantity < 10) {
      setTicketQuantity(ticketQuantity + 1)
    }
  }

  const decrement = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(ticketQuantity - 1)
    }
  }

  const getTheaters = async () => {
    const showingTheaters = await axios.get(`/api/theaters/get/by/location?location=${location}`)
    const possibleTheaters = showingTheaters.data.filter(theater => theater.movieId === movie.id)
    setTheaters(possibleTheaters)
  }

  const setPayments = () => {
    const types = ['Credit Card', 'Debit Card', 'PayPal']
    setPaymentType(types)
  }

  return (
    <div>
      <Button onClick={handleShow}>Purchase Tickets</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Purchase Tickets</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form className="purchase_forms">
            <Form.Group>
              <Form.Label>How many tickets do you want to purchase</Form.Label>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="danger" onClick={decrement}>-</Button>
                <div style={{ padding: '0 20px', fontSize: '18px' }}>{ticketQuantity}</div>
                <Button variant="success" onClick={increment}>+</Button>
              </div>
            </Form.Group>
          </Form>

          <Form className="purchase_forms">
            <Form.Group controlId="theaterSelection">
              <Form.Label>Choose the room number</Form.Label>
              <Form.Select
                value={selectedTheater}
                onChange={(e) => setSelectedTheater(e.target.value)}
                required
              >
                <option value="">Room options</option>
                {theaters.map(theater => (
                  <option key={theater.id} value={theater.id}>
                    {theater.roomNumber}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>

          <Form className="purchase_forms">
            <Form.Group>
              <Form.Label>Select payment type</Form.Label>
              <Form.Select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                required
              >
                <option value="">Payment options</option>
                {paymentType.map((payment, index) => (
                  <option key={index} value={payment}>
                    {payment}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {payment === 'PayPal' && (
              <Form.Group>
                <Form.Label>Enter your PayPal email</Form.Label>
                <Form.Control
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  required
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default PurchaseTickets