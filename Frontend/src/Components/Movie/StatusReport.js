import React, { useState } from "react"
import { Button, Form, Modal } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from "../Misc/AuthContext"
import "../../CSS/StatusReport.css"

const StatusReport = () => {
  const {  isLoggedIn, isAdmin } = useAuth()

  /* Part 1
    displays total number of tickets sold
  */

  /* Part 2 
    Iterates through the movie theaters, based on location,
    and displays the total number of tickets sold next to the city name

    Also displays the movies that are currently playing at the theaters
  */
  return (
    <div>
      {isLoggedIn && isAdmin ? (
        <div>
        </div>
      ) : (
        <div>
          <h1 style={{color: "white"}}>Status report only available to admins</h1>
        </div>
      )}
    </div>
  )
}

export default StatusReport