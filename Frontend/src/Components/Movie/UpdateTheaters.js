import React, { useEffect, useState } from "react"
import { useAuth } from "../Misc/AuthContext"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Form } from 'react-bootstrap'
import '../../CSS/UpdateTheaters.css'
import axios from 'axios'

const UpdateTheaters = () => {
  const nav = useNavigate()
  const { location } = useParams()
  const { isLoggedIn, isAdmin } = useAuth()
  const [theaters, setTheaters] = useState([])
  const [movies, setMovies] = useState([])

  useEffect(() => {
    getTheaters()
    getMovies()
    // eslint-disable-next-line
  }, [])

  const getTheaters = async () => {
    try {
      const locationTheaters = await axios.get(`/api/theaters/get/by/location?location=${location}`)
      setTheaters(locationTheaters.data)
    } catch (err) {
      console.log(err)
    }
  }

  const getMovies = async () => {
    try {
      const allMovies = await axios.get('/api/movies/all')
      setMovies(allMovies.data)
    } catch (err) {
      alert(err.message)
    }
  }

  const updateTheater = async (theaterLoc, theaterRoomNum, movieId) => {
    try {
      const updated = await axios.patch(`/api/theaters/change/movie?location=${theaterLoc}&roomNumber=${theaterRoomNum}&movieId=${movieId}`)
      alert(updated.data)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  const getMovieTitle = (movieId) => {
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].id === movieId) {
        return movies[i].title
      }
    }
  }

  return (
    <div className="update_theater_top_div">
      {isLoggedIn && isAdmin ? (
        <div>
          <h1 className="update_theater_div">{location} Theaters</h1>
          <Button className="update_theater_button" onClick={() => nav(`/${location}`)}>return</Button>
          <Form className="update_theater_form">
            {theaters.map(theater => (
              <Form.Group key={theater.id}>
                <Form.Label className="update_theater_label">Room Number {theater.roomNumber} currently playing {getMovieTitle(theater.movieId)}</Form.Label>
                <Form.Select
                  className="update_theater_select"
                  onChange={(e) => updateTheater(theater.location, theater.roomNumber, e.target.value)}
                >
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            ))}
          </Form>
        </div>
      ) : (
        <h1 className="update_theater_h1">Unauthorized</h1>
      )}
    </div>
  )
}

export default UpdateTheaters;