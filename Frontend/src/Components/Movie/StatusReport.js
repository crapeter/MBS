import React, { useState, useEffect } from "react"
import { Button } from 'react-bootstrap'
import { useAuth } from "../Misc/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import "../../CSS/StatusReport.css"

const StatusReport = () => {
  const locations = ['Lubbock', 'Amarillo', 'Levelland', 'Plainview', 'Snyder', 'Abilene']
  const nav = useNavigate()

  const {  isLoggedIn, isAdmin } = useAuth()
  const [ticketsSold, setTicketsSold] = useState(0)
  const [Location, setLocation] = useState('')
  const [playingMovies, setPlayingMovies] = useState([])
  const [movieCache, setMovieCache] = useState({})

  useEffect(() => {
    getAllTickets()
    for (let loc of locations) {
      getMovies(loc)
    }
    // eslint-disable-next-line
  }, [])

  const getAllTickets = async () => {
    try {
      const tickets = await axios.get('/api/tickets/all')
      const numSold = parseInt(tickets.data.slice(tickets.data.indexOf(':') + 1).trim())
      setTicketsSold(numSold)
    } catch (err) {
      alert(err)
    }
  }

  const toggleMovies = (loc) => {
    setLocation(Location === loc ? '' : loc)
  }

  const goBack = () => {
    nav('/locations')
  }

  const getMovies = async (location) => {
    if (movieCache[location]) {
      setPlayingMovies(movieCache[location])
      return
    }
    try {
      const [allMoviesResponse, locationTheatersResponse] = await Promise.all([
        axios.get('/api/movies/all'),
        axios.get(`/api/theaters/get/by/location?location=${location}`)
      ])

      const allMovies = allMoviesResponse
      const locationTheaters = locationTheatersResponse

      const theaterIds = locationTheaters.data.flatMap(theater => theater.movieIds)
      const  { playingMovies } = allMovies.data.reduce((acc, movie) => {
        if (theaterIds.includes(movie.id)) {
          acc.playingMovies.push(movie)
        }
        return acc
      }, { playingMovies: [] })

      playingMovies.sort((a, b) => { return a.title > b.title ? 1 : -1 })
      setPlayingMovies(playingMovies)
      setMovieCache({ ...movieCache, [location]: playingMovies })
    } catch (err) {
      alert(err)
    }
  }

  return (
    <div>
      {isLoggedIn && isAdmin ? (
        <div className="status_report_container_sr">
          <h3 className="tickets_sold">The total number of tickets sold between all theaters is: {ticketsSold}</h3>
          <Button className="status_report_button_sr" variant="danger" onClick={goBack}>Return</Button>
          <ul className="location_list_sr">
            {locations.map((location, index) => (
              <li key={index}>
                <h5
                  onClick={() => {
                    toggleMovies(location)
                    getMovies(location)
                  }}
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {location}
                </h5>

                {Location === location && (
                  <div className="location_info_sr">
                    <p className="current_movie_p_tag">Current movies:</p>
                    {playingMovies.map((movie, index) => (
                      <div key={index} className="movies_playing_at_loc_sr">
                        <p>{movie.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1 className="warning" style={{color: "white"}}>Status report only available to admins</h1>
        </div>
      )}
    </div>
  )
}

export default StatusReport