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
  const [openTheaterId, setOpenTheaterId] = useState(null)
  const times = ["11:00","2:30","5:00","8:30"]

  useEffect(() => {
    getTheaters()
    getMovies()
    // eslint-disable-next-line
  }, [])

  const toggleTheaterDetails = (theaterId) => {
    setOpenTheaterId(openTheaterId === theaterId ? null : theaterId)
  }

  const getTheaters = async () => {
    try {
      const locationTheaters = await axios.get(`/api/theaters/get/by/location?location=${location}`)
      const sortedTheaters = locationTheaters.data.sort((a, b) => a.roomNumber - b.roomNumber)
      setTheaters(sortedTheaters)
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

  const updateTheater = async (theaterLoc, theaterRoomNum, movieId, time) => {
    if (time === "11:00") {
      time = '11:00'
    } else if (time === "2:30") {
      time = '14:30'
    } else if (time === "5:00") {
      time = '17:00'
    } else if (time === "8:30") {
      time = '20:30'
    }
  
    try {
      const updated = await axios.patch(`/api/theaters/change/movie?location=${theaterLoc}&roomNumber=${theaterRoomNum}&movieId=${movieId}&time=${time}`);
      alert(updated.data);
    } catch (err) {
      alert(err.message)
    } finally {
      getTheaters()
    }
  };
  

  const getMovieTitle = (movieId) => {
    const movie = movies.find(movie => movie.id === movieId)
    return movie ? movie.title : "No Movie Selected"
  }

  return (
    <div className="update_theater_top_div_s">
      {isLoggedIn && isAdmin ? (
        <div className="update_theater_container_s">
          <h1 className="update_theater_div_s">{location} Theaters</h1>
          <Button className="update_theater_button_s" onClick={() => nav(`/${location}`)}>return</Button>
          <Form className="update_theater_form_s">
            {theaters.map(theater => (
              <div className="room_container_s">
                <Form.Label 
                  className="update_theater_label_s"
                  onClick={() => toggleTheaterDetails(theater.id)}
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Theater Number {theater.roomNumber}
                </Form.Label>
                {openTheaterId === theater.id && (
                  <div className="inner_stuff_s">
                    {times.map((time, index) => (
                      <Form.Group key={theater.id}>
                        {time === "11:00" ? (
                          <Form.Label className="update_theater_label">{time}am is playing: {getMovieTitle(theater.movieIds[index])}</Form.Label>
                        ) : (
                          <Form.Label className="update_theater_label">{time}pm is playing: {getMovieTitle(theater.movieIds[index])}</Form.Label>
                        )}
                        <Form.Select
                          className="update_theater_select_s"
                          onChange={(e) => updateTheater(theater.location, theater.roomNumber, e.target.value, time)}
                        >
                          <option value="" className="movies_options">Choose the new movie</option>
                          {movies.map(movie => (
                            <option key={movie.id} value={movie.id}>{movie.title}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Form>
        </div>
      ) : (
        <h1 className="update_theater_h1_s">Unauthorized</h1>
      )}
    </div>
  )
}

export default UpdateTheaters;