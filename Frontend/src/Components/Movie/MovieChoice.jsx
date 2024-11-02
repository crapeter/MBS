import React, { useEffect, useState } from "react"
import { Modal, Button } from 'react-bootstrap'
import ViewTickets from './ViewTickets'
import '../../CSS/MovieChoice.css'

const MovieChoice = ({ movie, location, ticketUpdated, showTimes }) => {
  const [show, setShow] = useState(false)
  const [roomNumbers, setRoomNumbers] = useState([])

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
  }

  useEffect(() => {
    getRoomNumbers()
    // eslint-disable-next-line
  }, [showTimes])

  const getRoomNumbers = async () => {
    let roomNumbers = showTimes.split(" | ")
    setRoomNumbers(roomNumbers)
  }

  return (
    <div>
      <Button variant="info" onClick={handleShow}>View Tickets</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choose what time your movie is playing and the theater number</Modal.Title>
        </Modal.Header>
        <div className="tickets_container">
          {roomNumbers.map((roomNumber) => (
            <ViewTickets key={roomNumber} movie={movie} location={location} ticketUpdated={ticketUpdated} roomNumber={roomNumber}/>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default MovieChoice;