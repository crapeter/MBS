import React, { useState, useEffect } from "react";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import "../../CSS/TicketDisplay.css";

const TicketDisplay = () => {
  const nav = useNavigate();
  const { isLoggedIn, userEmail } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [openTicketId, setOpenTicketId] = useState(null);
  const [ticketData, setTicketData] = useState([]);
  const [show, setShow] = useState(false);
  const [infoCache, setInfoCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [movieTitle, setMovieTitle] = useState("");

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `/api/users/all/tickets?email=${userEmail}`
        );
        setTickets(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTickets();
  }, [userEmail]);

  const handleToggle = (ticketId) => {
    setOpenTicketId(openTicketId === ticketId ? null : ticketId);
  };

  const goBack = () => {
    nav(-1);
  };

  const getTickets = async (idx, ticket) => {
    setMovieTitle(ticket.movieTitle);
    handleShow();
    if (infoCache[idx]) {
      setTicketData(infoCache[idx]);
      return;
    }
    await axios
      .get(
        `/api/users/tickets/${userEmail}/${ticket.movieId}/${ticket.location}/${ticket.roomNumber}/${ticket.time}`
      )
      .then((res) => {
        const userTickets = String(res.data);
        const uTickets = userTickets.split(",");
        setTicketData(uTickets);
        setInfoCache({ ...infoCache, [idx]: uTickets });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="ticket_display_super">
      {isLoggedIn && (
        <div className="ticket_display_container">
          <h1 className="header">Your Tickets</h1>
          <Button variant="danger" onClick={goBack}>
            Return
          </Button>
          {loading ? (
            <div className="spinner_container">
              <p className="loading_movies">Loading Movie Tickets</p>
              <p className="ticket_spinner"></p>
            </div>
          ) : (
            <div>
              <ul className="tickets_display_list">
                {tickets.map((ticket, idx) => (
                  <li key={idx} className="tickets_display_info">
                    <p
                      onClick={() => handleToggle(idx)}
                      style={{ cursor: "pointer" }}
                      className="ticket_display_title"
                    >
                      Movie Title: {ticket.movieTitle}
                    </p>
                    {openTicketId === idx && (
                      <div className="ticket_display_data">
                        <p>Number Purchased: {ticket.numberPurchased}</p>
                        <p>Location: {ticket.location}</p>
                        <p>Theater Number: {ticket.roomNumber}</p>
                        {ticket.time === "11:00" ? (
                          <p>Time: {ticket.time}pm</p>
                        ) : (
                          <p>Time: {ticket.time}am</p>
                        )}
                        <Button
                          variant="success"
                          onClick={() => getTickets(idx, ticket)}
                        >
                          View Ticket Codes
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Your ticket numbers for {movieTitle}</Modal.Title>
              </Modal.Header>
              <div>
                {ticketData.map((ticket, idx) => (
                  <p key={idx} className="tickets">
                    {ticket}
                  </p>
                ))}
              </div>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDisplay;
