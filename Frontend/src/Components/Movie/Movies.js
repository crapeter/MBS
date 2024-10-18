import React, { useEffect, useState } from "react"
import { useAuth } from "../Misc/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button, Form } from 'react-bootstrap'
import PurchaseTickets from "./PurchaseTickets"
import ViewTickets from "./ViewTickets"
import AddMovie from "./AddMovie"
import '../../CSS/Movies.css'
import axios from 'axios'

const Movies = ({ location }) => {
  const nav = useNavigate()
  const movieDisplays = ['All Movies', 'Current Movie Catalog', 'Upcoming Movie Catalog']

	const { isLoggedIn, isAdmin } = useAuth()
  const [movies, setMovies] = useState([])
  const [openMovieId, setOpenMovieId] = useState(null)
  const [ticketUpdated, setTicketUpdated] = useState(false)
  const [movieDisplay, setMovieDisplay] = useState('Current Movie Catalog')
  const [allMovies, setAllMovies] = useState([])
  const [theaters, setTheaters] = useState([])
  const [theaterMovieIds, setTheaterMovies] = useState([])

  useEffect(() => {
    getMovies()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    filterMovies()
    // eslint-disable-next-line
  }, [movieDisplay])

  useEffect(() => {
    setMovieIds()
    // eslint-disable-next-line
  }, [movies])

  const locations = () => {
    nav('/locations')
  }

  const refreshTickets = () => {
    setTicketUpdated(prev => !prev)
  }

  const toggleMovieDetails = (movieId) => {
    setOpenMovieId(openMovieId === movieId ? null : movieId)
  }

  const toSearch = () => {
    nav(`/${location}/search`)
  }

  const toReviews = (movie) => {
    nav(`/${location}/${movie.title}/reviews`)
  }

  const toUpdateTheaters = () => {
    nav(`/${location}/playing`)
  }

  const getMovies = async () => {
    try {
      const allMovies = await axios.get('/api/movies/all')
      const locationTheaters = await axios.get(`/api/theaters/get/by/location?location=${location}`)

      const allMovieIds = allMovies.data.map(movie => movie.id)
      const moviesAtLoc = locationTheaters.data.filter(theater => allMovieIds.includes(theater.movieId))
      
      const totalMovies = allMovies.data.filter(movie => moviesAtLoc.map(theater => theater.movieId).includes(movie.id))

      setMovies(totalMovies)
      setTheaters(locationTheaters.data)
      setAllMovies(allMovies.data)
    } catch (err) {
      alert(err)
    }
  }

  const filterMovies = () => {
    const movieList = [...allMovies]
    const theaterList = [...theaters]

    if (movieDisplay === 'Current Movie Catalog') {
      const movie = movieList.filter(movie => theaterList.map(theater => theater.movieId).includes(movie.id))
      setMovies(movie)
    } else if (movieDisplay === 'Upcoming Movie Catalog') {
      const movie = movieList.filter(movie => !theaterList.map(theater => theater.movieId).includes(movie.id))
      setMovies(movie)
    } else if (movieDisplay === 'All Movies') {
      setMovies(movieList)
    }
  }

  const setMovieIds = () => {
    const movieList = [...allMovies]
    const theaterList = [...theaters]

    const movie = movieList.filter(movie => theaterList.map(theater => theater.movieId).includes(movie.id))
    const movieIds = movie.map(movie => movie.id)
    setTheaterMovies(movieIds)
  }

  return (
    <div className="movie_div">
      {isLoggedIn ? (
        <div className="movies">
          <h1 onClick={locations} className="movies_header">Movies showing in {location}</h1>
          <div className="user_buttons">
            <Button variant="danger" onClick={toSearch}>Search Movies</Button>
            {isAdmin && (
              <div className="user_admin_buttons">
                <AddMovie className="give_me_some_space" location={location}/>
                <Button className="give_me_some_space" variant="info" onClick={toUpdateTheaters}>Update Theaters</Button>
              </div>
            )}
          </div>
          <h3 className="movies_header">
            <Form>
              <Form.Select
                value={movieDisplay}
                onChange={(e) => setMovieDisplay(e.target.value)}
                required
              >
                <option value="">View Movies</option>
                {movieDisplays.map((display, idx) => (
                  <option key={idx} value={display}>{display}</option>
                ))}
              </Form.Select>
            </Form>
          </h3>
          <ul className="movie_list">
            {movies.map(movie => (
              <li key={movie.id}>
                <p 
                  onClick={() => toggleMovieDetails(movie.id)} 
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
									className="movie_title"
                >
                  {movie.title}
                </p>

                {openMovieId === movie.id && (
                  <div className="movie_details" style={{ marginLeft: '20px' }}>
										<div>
											<p><strong>Genre:</strong> {movie.genre}</p>
											<p><strong>Runtime:</strong> {movie.runTime} mins</p>
											<p><strong>Show time:</strong> {movie.showTime}</p>
											<p><strong>Release Date:</strong> {movie.releaseDate}</p>
											<p><strong>Director:</strong> {movie.director}</p>
											<p><strong>Cast:</strong> {movie.cast}</p>
											<p><strong>Description:</strong> {movie.description}</p>
										</div>
                    {theaterMovieIds.includes(movie.id) && (
                      <div>
                        <div className="purchase_tickets">
                          <PurchaseTickets className="movie_buttons" movie={movie} location={location} refreshTickets={refreshTickets}/>
                        </div>
                        <div className="view_tickets">
                          <ViewTickets className="movie_buttons" movie={movie} location={location} ticketUpdated={ticketUpdated}/>
                        </div>
                      </div>
                    )}
                    <div className="review_movie_button">
                      <Button className="movie_buttons" variant="success" onClick={() => toReviews(movie)}>View Reviews</Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1 style={{color: "white"}}>Log in to view movies</h1>
        </div>
      )}
    </div>
  )
}

export default Movies
