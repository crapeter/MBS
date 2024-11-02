import React, { useEffect, useState } from "react"
import { Modal, Button } from 'react-bootstrap'
import { useAuth } from "../Misc/AuthContext";
import axios from "axios"
import '../../CSS/ViewTickets.css'

const ViewTickets = ({ movie, location, ticketUpdated, roomNumber }) => {
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
    let rNum = roomNumber.split(" ")[1]
    rNum = rNum.substring(0, rNum.length - 1)
    let idx = roomNumber.indexOf(":")
    let part1 =  roomNumber.slice(idx + 1)
    let idx2 = part1.indexOf(":")
    let time = part1.substring(0, idx2+3)

    await axios.get(`/api/users/tickets/${userEmail}/${movie.id}/${location}/${rNum}/${time}`)
    .then(res => {
      const userTickets = String(res.data)
      const uTickets = userTickets.split(',')
      setTickets(uTickets)
    })
    .catch(err => alert(err.message))
  }

  return (
    <div>
      <Button className="show_tickets_button" variant="info" onClick={handleShow}>{roomNumber}</Button>
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