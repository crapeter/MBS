import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from 'react-bootstrap'
import '../../CSS/HomePage.css'
import axios from 'axios'

const HomePage = () => {
  const nav = useNavigate()

  const [movies, setMovies] = useState([])
  const [openMovieId, setOpenMovieId] = useState(null)
  const [viewCurrentCatalog, setViewCurrentCatalog] = useState(false)

  useEffect(() => {
    try {
      getMovies()
    } catch (err) {
      alert(err)
    }
    // eslint-disable-next-line
  }, [])

  const getMovies = async () => {
    try {
      const allMovies = await axios.get('/api/movies/all')
      const sortedMovies = allMovies.data.sort((a, b) => { return a.title > b.title ? 1 : -1 })
      setMovies(sortedMovies)
    } catch (err) {
      alert(err.message)
    }
  }

  const toggleMovieDetails = (movieId) => {
    setOpenMovieId(openMovieId === movieId ? null : movieId)
  }

  const toggleCurrentCatalog = () => {
    setViewCurrentCatalog(!viewCurrentCatalog)
  }

  const toReviews = (movie) => {
    nav(`/${movie.title}/reviews`)
  }

  // Abiliene, Amarillo, Levelland, Lubbock, Plainview, Snyder
  return (
    <div className="home_page_div">
      <div className="home_page_container">
        <div className="home_page_header">
          <h1>Welcome to our movie booking system.</h1>
          <Button className="to_login_page" variant="primary" onClick={() => nav('/login')}>Login</Button>
        </div>
        <button className="view_home_page_catalog" onClick={toggleCurrentCatalog}>View Current movie catalog</button>
        {viewCurrentCatalog && (
          <ul className="home_page_movie_list">
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
                  <div className="home_page_movie_details" style={{ marginLeft: '20px' }}>
                    <div>
                      <p className="home_page_movie_text"><strong>Genre:</strong> {movie.genre}</p>
                      <p className="home_page_movie_text"><strong>Runtime:</strong> {movie.runTime}</p>
                      <p className="home_page_movie_text"><strong>Release Date:</strong> {movie.releaseDate}</p>
                      <p className="home_page_movie_text"><strong>Director:</strong> {movie.director}</p>
                      <p className="home_page_movie_text"><strong>Cast:</strong> {movie.cast}</p>
                      <p className="home_page_movie_text"><strong>Description:</strong> {movie.description}</p>
                    </div>
                    <div className="movie_buttons_flex">
                      <Button className="movie_buttons" variant="success" onClick={() => toReviews(movie)}>View Reviews</Button>
                    </div>
                  </div>
                )}
                </li>
              ))}
            </ul>
        )}
      </div>
    </div>
  )
}

export default HomePage;