import React, { useEffect, useState } from "react";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom"
import '../../CSS/Movies.css';
import PurchaseTickets from "./PurchaseTickets";
import ViewTickets from "./ViewTickets";
import axios from 'axios';

const Movies = ({ location }) => {
  const nav = useNavigate()
  const [movies, setMovies] = useState([]);
  const [openMovieId, setOpenMovieId] = useState(null);
	const { isLoggedIn } = useAuth();
  const [ticketUpdated, setTicketUpdated] = useState(false);

  useEffect(() => {
    getMovies();
    // eslint-disable-next-line
  }, []);

  const locations = () => {
    nav('/locations')
  }

  const refreshTickets = () => {
    setTicketUpdated(prev => !prev)
  }

  const getMovies = async () => {
    try {
      const allMovies = await axios.get('/api/movies/all');
      const locationTheaters = await axios.get(`/api/theaters/get/by/location?location=${location}`);

      const allMovieIds = allMovies.data.map(movie => movie.id);
      const moviesAtLoc = locationTheaters.data.filter(theater => allMovieIds.includes(theater.movieId));
      
      const totalMovies = allMovies.data.filter(movie => moviesAtLoc.map(theater => theater.movieId).includes(movie.id));

      setMovies(totalMovies);
    } catch (err) {
      alert(err);
    }
  };

  const toggleMovieDetails = (movieId) => {
    setOpenMovieId(openMovieId === movieId ? null : movieId);
  };

  return (
    <div className="movie_div">
      {isLoggedIn ? (
        <div>
          <h1 onClick={locations} className="movies_header">Movies available in {location}</h1>
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
										<div className="purchase_tickets">
                      <PurchaseTickets className="movie_buttons" movie={movie} location={location} refreshTickets={refreshTickets}/>
										</div>
                    <div className="view_tickets">
                      <ViewTickets className="movie_buttons" movie={movie} location={location} ticketUpdated={ticketUpdated}/>
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
  );
};

export default Movies;
