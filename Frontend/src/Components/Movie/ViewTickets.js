import React, { useEffect, useState } from "react"
import { Modal, Button } from 'react-bootstrap'
import { useAuth } from "../Misc/AuthContext";
import axios from "axios"
import '../../CSS/ViewTickets.css'

const ViewTickets = ({ movie, location, ticketUpdated }) => {
  const { userEmail } = useAuth()
  const [show, setShow] = useState(false)
  const [tickets, setTickets] = useState([])

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
  }

  useEffect(() => {
    getTickets()
    // eslint-disable-next-line
  }, [movie.id, ticketUpdated])

  const getTickets = async () => {
    await axios.get(`/api/users/tickets/${userEmail}/${movie.id}/${location}`)
    .then(res => {
      const userTickets = String(res.data)
      const uTickets = userTickets.split(',')
      setTickets(uTickets)
    })
    .catch(err => alert(err.message))
  }

  return (
    <div>
      <Button variant="info" onClick={handleShow}>View Tickets</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your ticket numbers for {movie.title}</Modal.Title>
        </Modal.Header>
        <div>
          {tickets.map((ticket, idx) => (
            <p key={idx} className="tickets">{ticket}</p>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default ViewTickets;