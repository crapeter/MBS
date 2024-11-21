import React, { useEffect, useState } from "react";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import PurchaseTickets from "./PurchaseTickets";
import MovieChoise from "./MovieChoice";
import "../../CSS/SearchMovies.css";
import axios from "axios";

const SearchMovies = ({ location }) => {
  const nav = useNavigate();
  const { isLoggedIn } = useAuth();
  const [filterMovies, setFilterMovies] = useState([]);
  const [openMovieId, setOpenMovieId] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [ticketUpdated, setTicketUpdated] = useState(false);
  const [search, setSearch] = useState("");
  const [theaters, setTheaters] = useState([]);
  const [theaterMovieIds, setTheaterMovieIds] = useState([]);
  const [moviePosterCache, setMoviePosterCache] = useState({});
  const [postersLoading, setPostersLoading] = useState(true);

  useEffect(() => {
    getMovies();
    getMoviePoster();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterMovie();
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    setMovieIds();
    // eslint-disable-next-line
  }, [theaters, allMovies]);

  const refresh = () => {
    window.location.reload();
  };

  const refreshTickets = () => {
    setTicketUpdated((prev) => !prev);
  };

  const toggleMovieDetails = (movieId) => {
    setOpenMovieId(openMovieId === movieId ? null : movieId);
  };

  const toReviews = (movie) => {
    nav(`/${movie.title}/reviews`);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const getMovies = async () => {
    try {
      const [allMoviesResponse, locationTheatersResponse] = await Promise.all([
        axios.get("/api/movies/all"),
        axios.get(`/api/theaters/get/by/location?location=${location}`),
      ]);

      const allMovies = allMoviesResponse;
      const locationTheaters = locationTheatersResponse;

      setAllMovies(allMovies.data);
      setFilterMovies(allMovies.data);
      setTheaters(locationTheaters.data);
    } catch (err) {
      alert(err);
    }
  };

  const getMoviePoster = async () => {
    try {
      const posters = await axios.get("/api/posters/get");
      const newPosterCache = posters.data.reduce((acc, poster) => {
        acc[poster.movieId] = poster.image;
        return acc;
      }, {});
      setMoviePosterCache(newPosterCache);
      setPostersLoading(false);
    } catch (error) {
      console.error("Error fetching movie posters:", error);
    }
  };

  const filterMovie = () => {
    let movieCopies = [...allMovies];
    let movies = movieCopies.filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilterMovies(movies);
  };

  const setMovieIds = () => {
    const movieList = [...allMovies];
    const theaterList = [...theaters];
    const theaterIds = theaterList.flatMap((theater) => theater.movieIds);

    const movie = movieList.filter((movie) => theaterIds.includes(movie.id));
    const movieIds = movie.map((movie) => movie.id);
    setTheaterMovieIds(movieIds);
  };

  const getShowTimes = (movie) => {
    let showTimes = "";
    for (let i = 0; i < theaters.length; i++) {
      if (theaters[i].movieIds.includes(movie.id)) {
        for (let j = 0; j < theaters[i].movieIds.length; j++) {
          if (theaters[i].movieIds[j] === movie.id) {
            let time = "";
            switch (j) {
              case 0:
                time = "11:00am";
                break;
              case 1:
                time = "2:30pm ";
                break;
              case 2:
                time = "5:00pm";
                break;
              case 3:
                time = "8:30pm";
                break;
              default:
                time = "No showtimes available";
            }
            showTimes +=
              "Theater " + theaters[i].roomNumber + ": " + time + " | ";
          }
        }
      }
    }
    if (showTimes === "") {
      showTimes = "No showtimes available";
    } else {
      showTimes = showTimes.slice(0, -3);
    }
    return showTimes;
  };

  const goBack = () => {
    nav(-1);
  };

  return (
    <div className="search_movie_div">
      {isLoggedIn && (
        <div className="search_div">
          <h1 onClick={goBack} style={{ cursor: "pointer" }}>
            Search for a Movie
          </h1>
          <div className="top_features">
            <input
              value={search}
              type="text"
              placeholder="Search for a movie"
              onChange={(e) => setSearch(e.target.value)}
              className="search_input"
            />
            <Button
              variant="danger"
              onClick={goBack}
              style={{ padding: "10px", width: "100px" }}
            >
              Return
            </Button>
          </div>
          <div>
            {postersLoading ? (
              <div className="spinner_container">
                <p className="loading_movies">Loading Movies</p>
                <p className="spinner"></p>
              </div>
            ) : (
              <div className="movie_grid">
                {filterMovies.map((movie) => (
                  <div key={movie.id} className="movie_item">
                    <div onClick={() => toggleMovieDetails(movie.id)}>
                      <img
                        loading="lazy"
                        src={`data:image/jpeg;base64,${
                          moviePosterCache[movie.id]
                        }`}
                        alt="Movie Poster"
                        style={{ width: "300px", height: "450px" }}
                      />
                      <p
                        style={{ cursor: "pointer", fontWeight: "bold" }}
                        className="movie_title"
                      >
                        {movie.title}
                      </p>
                    </div>

                    {openMovieId === movie.id && (
                      <div
                        className="movie_details"
                        style={{
                          marginLeft: "20px",
                          border: "2px solid black",
                        }}
                      >
                        <Button
                          className="big_review_button"
                          variant="success"
                          onClick={() => toReviews(movie)}
                          style={{ color: "black", fontSize: "1.5rem" }}
                        >
                          Reviews
                        </Button>
                        <div>
                          <p>
                            <strong>Genre:</strong> {movie.genre}
                          </p>
                          <p>
                            <strong>Price:</strong> {formatPrice(movie.price)}
                          </p>
                          <p>
                            <strong>Runtime:</strong> {movie.runTime}
                          </p>
                          <p>
                            <strong>Show time:</strong> {getShowTimes(movie)}
                          </p>
                          <p>
                            <strong>Release Date:</strong> {movie.releaseDate}
                          </p>
                          <p>
                            <strong>Director:</strong> {movie.director}
                          </p>
                          <p>
                            <strong>Cast:</strong> {movie.cast}
                          </p>
                          <p>
                            <strong>Description:</strong> {movie.description}
                          </p>
                        </div>

                        <div className="movie_buttons_flex">
                          {theaterMovieIds.includes(movie.id) && (
                            <div className="movie_buttons_flex">
                              <PurchaseTickets
                                className="movie_buttons"
                                movie={movie}
                                location={location}
                                refreshTickets={refreshTickets}
                                showTimes={getShowTimes(movie)}
                                refresh={refresh}
                              />
                              <MovieChoise
                                className="movie_buttons"
                                movie={movie}
                                location={location}
                                ticketUpdated={ticketUpdated}
                                showTimes={getShowTimes(movie)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMovies;
