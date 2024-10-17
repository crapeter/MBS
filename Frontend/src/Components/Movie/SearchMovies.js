import React, { useEffect, useState } from "react"
import { useAuth } from "../Misc/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from 'react-bootstrap'
import PurchaseTickets from "./PurchaseTickets"
import ViewTickets from "./ViewTickets"
import '../../CSS/SearchMovies.css'
import axios from 'axios'

const SearchMovies = ({ location }) => {
  const nav = useNavigate()
  const { isLoggedIn } = useAuth()
  const [filterMovies, setFilterMovies] = useState([])
  const [openMovieId, setOpenMovieId] = useState(null)
  const [allMovies, setAllMovies] = useState([])
  const [ticketUpdated, setTicketUpdated] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getMovies()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    filterMovie()
    // eslint-disable-next-line
  }, [search])

  const refreshTickets = () => {
    setTicketUpdated(prev => !prev)
  }

  const toggleMovieDetails = (movieId) => {
    setOpenMovieId(openMovieId === movieId ? null : movieId)
  }

  const getMovies = async () => {
    try {
      const allMovies = await axios.get('/api/movies/all')
      const locationTheaters = await axios.get(`/api/theaters/get/by/location?location=${location}`)

      const allMovieIds = allMovies.data.map(movie => movie.id)
      const moviesAtLoc = locationTheaters.data.filter(theater => allMovieIds.includes(theater.movieId))

      const totalMovies = allMovies.data.filter(movie => moviesAtLoc.map(theater => theater.movieId).includes(movie.id))

      setAllMovies(totalMovies)
      setFilterMovies(totalMovies)
    } catch (err) {
      alert(err)
    }
  }

  const filterMovie = () => {
    let movieCopies = [...allMovies]
    let movies = movieCopies.filter(movie => 
      movie.title.toLowerCase().includes(search.toLowerCase())
    )
    setFilterMovies(movies)
  }

  const goBack = () => {
    nav(`/${location}`)
  }

  return (
    <div className="search_movie_div">
      {isLoggedIn && (
        <div className="search_div">
          <h1>Search for a Movie</h1>
          <div className="top_features">
            <input
              value={search}
              type="text"
              placeholder="Search for a movie"
              onChange={(e) => setSearch(e.target.value)}
              className="search_input"
            />
            <Button className="return_button" variant="danger" onClick={goBack}>Return</Button>
          </div>
          <ul className="movie_list">
            {filterMovies.map(movie => (
              <li key={movie.id}>
                <p
                  onClick={() => toggleMovieDetails(movie.id)}
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  className="movie_title"
                >
                  {movie.title}
                </p>

                {openMovieId === movie.id && (
                  <div className="search_movie_details" style={{ marginLeft: '20px' }}>
                    <div>
                      <p><strong>Genre:</strong> {movie.genre}</p>
                      <p><strong>Runtime:</strong> {movie.runTime} mins</p>
                      <p><strong>Show time:</strong> {movie.showTime}</p>
                      <p><strong>Release Date:</strong> {movie.releaseDate}</p>
                      <p><strong>Director:</strong> {movie.director}</p>
                      <p><strong>Cast:</strong> {movie.cast}</p>
                      <p><strong>Description:</strong> {movie.description}</p>
                    </div>
                    {movie.isPlaying && (
                      <div>
                        <div className="purchase_tickets">
                          <PurchaseTickets className="movie_buttons" movie={movie} location={location} refreshTickets={refreshTickets}/>
                        </div>
                        <div className="view_tickets">
                          <ViewTickets className="movie_buttons" movie={movie} location={location} ticketUpdated={ticketUpdated}/>
                        </div>
                      </div>
                    )}
                  </div>
                  )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchMovies