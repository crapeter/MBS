import React, { useEffect, useState } from "react";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import PurchaseTickets from "./PurchaseTickets";
import MovieChoise from "./MovieChoice";
import Logout from "../Misc/Logout";
import TicketDisplay from "../Misc/ToTicketDisplay";
import "../../CSS/Movies.css";
import axios from "axios";

const Movies = () => {
  const nav = useNavigate();
  const movieDisplays = [
    "All Movies",
    "Currently Playing Movies",
    "Upcoming Movie Catalog",
  ];
  const locations = [
    "Abilene",
    "Amarillo",
    "Levelland",
    "Lubbock",
    "Plainview",
    "Snyder",
  ];

  const { isLoggedIn, isAdmin, userLocation, setUserLocation } = useAuth();
  const [movies, setMovies] = useState([]);
  const [openMovieId, setOpenMovieId] = useState(null);
  const [ticketUpdated, setTicketUpdated] = useState(false);
  const [movieDisplay, setMovieDisplay] = useState("All Movies");
  const [allMovies, setAllMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [theaterMovieIds, setTheaterMovies] = useState([]);
  const [isPlaying, setIsPlaying] = useState([]);
  const [isUpcoming, setIsUpcoming] = useState([]);
  const [viewLocation, setViewLocation] = useState(
    userLocation ? userLocation : "Lubbock"
  );
  const [moviePosterCache, setMoviePosterCache] = useState({});
  const [postersLoading, setPostersLoading] = useState(true);
  const [pageUpdated, setPageUpdated] = useState(false);

  useEffect(() => {
    try {
      getMovies();
      getMoviePoster();
    } catch (err) {
      alert(err);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getFilteredMovies();
    // eslint-disable-next-line
  }, [movieDisplay]);

  useEffect(() => {
    setMovieIds();
    // eslint-disable-next-line
  }, [movies]);

  useEffect(() => {
    getMovies();
    setMovieDisplay("All Movies");
    // eslint-disable-next-line
  }, [viewLocation]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/api/movies/all");
        setAllMovies(response.data);
        if (movieDisplay === "All Movies") setMovies(response.data);
        else if (movieDisplay === "Currently Playing Movies")
          setMovies(
            response.data.filter((movie) => theaterMovieIds.includes(movie.id))
          );
        else if (movieDisplay === "Upcoming Movie Catalog")
          setMovies(
            response.data.filter((movie) => !theaterMovieIds.includes(movie.id))
          );
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
    // eslint-disable-next-line
  }, [pageUpdated]);

  const refreshTickets = () => {
    setTicketUpdated((prev) => !prev);
  };

  const toggleMovieDetails = (movieId) => {
    setOpenMovieId(openMovieId === movieId ? null : movieId);
  };

  const refresh = () => {
    setPageUpdated((prev) => !prev);
  };

  const toSearch = () => {
    nav(`/${viewLocation}/search`);
  };

  const toReviews = (movie) => {
    nav(`/${movie.title}/reviews`);
  };

  const toUpdateTheaters = () => {
    nav(`/${viewLocation}/playing`);
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
        axios.get(`/api/theaters/get/by/location?location=${viewLocation}`),
      ]);

      const allMovies = allMoviesResponse;
      const locationTheaters = locationTheatersResponse;

      setMovies(allMovies.data);

      const theaterIds = locationTheaters.data.flatMap(
        (theater) => theater.movieIds
      );
      const { playingMovies, upcomingMovies } = allMovies.data.reduce(
        (acc, movie) => {
          if (theaterIds.includes(movie.id)) {
            acc.playingMovies.push(movie);
          } else {
            acc.upcomingMovies.push(movie);
          }
          return acc;
        },
        { playingMovies: [], upcomingMovies: [] }
      );

      setTheaters(locationTheaters.data);
      setAllMovies(allMovies.data);
      setIsPlaying(playingMovies);
      setIsUpcoming(upcomingMovies);
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

  const getFilteredMovies = () => {
    if (movieDisplay === "Currently Playing Movies") {
      setMovies(isPlaying);
    } else if (movieDisplay === "Upcoming Movie Catalog") {
      setMovies(isUpcoming);
    } else if (movieDisplay === "All Movies") {
      setMovies(allMovies);
    }
  };

  const setMovieIds = () => {
    const movieList = [...allMovies];
    const theaterList = [...theaters];
    const theaterIds = theaterList.flatMap((theater) => theater.movieIds);

    const movie = movieList.filter((movie) => theaterIds.includes(movie.id));
    const movieIds = movie.map((movie) => movie.id);
    setTheaterMovies(movieIds);
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

  const navToAdminPage = () => {
    nav("/Admin");
  };

  return (
    <div className="movie_div">
      {isLoggedIn ? (
        <div className="movies">
          <h1 className="movies_header">
            Movies showing in {userLocation ? userLocation : viewLocation}
          </h1>

          <div className="user_buttons">
            <div className="user_public_buttons">
              <Button variant="primary" onClick={toSearch}>
                Search Movies
              </Button>
              <TicketDisplay />
            </div>
            {isAdmin && (
              <div className="user_admin_buttons">
                <Button variant="success" onClick={toUpdateTheaters}>
                  Update Theaters
                </Button>
                <Button variant="success" onClick={navToAdminPage}>
                  Admin Page
                </Button>
              </div>
            )}
            <div className="user_logout_button">
              <Logout />
            </div>
          </div>

          <h3 className="movies_header">
            <Form className="option_form">
              <div className="dropdown_container">
                <Form.Select
                  value={viewLocation}
                  onChange={(e) => {
                    setViewLocation(e.target.value);
                    setUserLocation(e.target.value);
                  }}
                  className="location_header_select"
                  required
                >
                  <option value="" className="movies_options">
                    Select Location
                  </option>
                  {locations.map((location, idx) => (
                    <option
                      key={idx}
                      value={location}
                      className="movie_options"
                    >
                      {location}
                    </option>
                  ))}
                </Form.Select>
                <Form.Select
                  value={movieDisplay}
                  onChange={(e) => setMovieDisplay(e.target.value)}
                  className="movies_header_select"
                  required
                >
                  <option value="" className="movies_options">
                    View Movies
                  </option>
                  {movieDisplays.map((display, idx) => (
                    <option key={idx} value={display} className="movie_options">
                      {display}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form>
          </h3>

          <div className="movie_grid">
            {movies.length === 0 ? (
              <div>
                {movieDisplay === "Currently Playing Movies" ? (
                  <div>
                    <h1 style={{ color: "white" }}>
                      No movies currently playing
                    </h1>
                  </div>
                ) : (
                  <div>
                    {movieDisplay === "Upcoming Movie Catalog" ? (
                      <div>
                        <h1 style={{ color: "white" }}>
                          No upcoming movies in the catalog
                        </h1>
                      </div>
                    ) : (
                      <div>
                        <h1>No movies available</h1>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="movie_grid">
                  {movies.map((movie) => (
                    <div key={movie.id} className="movie_item">
                      <div onClick={() => toggleMovieDetails(movie.id)}>
                        {postersLoading ? (
                          <div className="spinner_container">
                            <p className="loading_movies">
                              Loading Movie Posters
                            </p>
                            <p className="spinner"></p>
                          </div>
                        ) : (
                          <div>
                            <img
                              loading="lazy"
                              src={`data:image/jpeg;base64,${
                                moviePosterCache[movie.id]
                              }`}
                              alt="Movie Poster"
                              style={{
                                width: "300px",
                                height: "450px",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <p
                        style={{ cursor: "pointer", fontWeight: "bold" }}
                        className="movie_title"
                        onClick={() => toggleMovieDetails(movie.id)}
                      >
                        {movie.title}
                      </p>
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
                                  location={viewLocation}
                                  refreshTickets={refreshTickets}
                                  showTimes={getShowTimes(movie)}
                                  refresh={refresh}
                                />
                                <MovieChoise
                                  className="movie_buttons"
                                  movie={movie}
                                  location={viewLocation}
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
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h1 style={{ color: "white" }}>Log in to view movies</h1>
        </div>
      )}
    </div>
  );
};

export default Movies;
