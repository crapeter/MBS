import React, { useEffect, useState } from "react";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import PurchaseTickets from "./PurchaseTickets";
import MovieChoise from "./MovieChoice";
import AddMovie from "./AddMovie";
import AddPoster from "./AddPoster";
import MoviePoster from "./MoviePoster";
import Logout from "../Misc/Logout";
import "../../CSS/Movies.css";
import axios from "axios";

const Movies = ({ location }) => {
  const nav = useNavigate();
  const movieDisplays = [
    "All Movies",
    "Current Movie Catalog",
    "Upcoming Movie Catalog",
  ];

  const { isLoggedIn, isAdmin } = useAuth();
  const [movies, setMovies] = useState([]);
  const [openMovieId, setOpenMovieId] = useState(null);
  const [ticketUpdated, setTicketUpdated] = useState(false);
  const [movieDisplay, setMovieDisplay] = useState("All Movies");
  const [allMovies, setAllMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [theaterMovieIds, setTheaterMovies] = useState([]);
  const [isPlaying, setIsPlaying] = useState([]);
  const [isUpcoming, setIsUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      getMovies();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
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

  const refreshTickets = () => {
    setTicketUpdated((prev) => !prev);
  };

  const toggleMovieDetails = (movieId) => {
    setOpenMovieId(openMovieId === movieId ? null : movieId);
  };

  const toSearch = () => {
    nav(`/${location}/search`);
  };

  const toReviews = (movie) => {
    nav(`/${movie.title}/reviews`);
  };

  const toUpdateTheaters = () => {
    nav(`/${location}/playing`);
  };

  const getMovies = async () => {
    try {
      const [allMoviesResponse, locationTheatersResponse] = await Promise.all([
        axios.get("/api/movies/all"),
        axios.get(`/api/theaters/get/by/location?location=${location}`),
      ]);

      const allMovies = allMoviesResponse;
      const locationTheaters = locationTheatersResponse;

      // sort allMovies by title a..z
      const sortedMovies = allMovies.data.sort((a, b) => {
        return a.title > b.title ? 1 : -1;
      });
      setMovies(sortedMovies);

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

      playingMovies.sort((a, b) => {
        return a.title > b.title ? 1 : -1;
      });
      upcomingMovies.sort((a, b) => {
        return a.title > b.title ? 1 : -1;
      });

      setTheaters(locationTheaters.data);
      setAllMovies(allMovies.data);
      setIsPlaying(playingMovies);
      setIsUpcoming(upcomingMovies);
    } catch (err) {
      alert(err);
    }
  };

  const getFilteredMovies = () => {
    if (movieDisplay === "Current Movie Catalog") {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="movie_div">
      {isLoggedIn ? (
        <div className="movies">
          <h1 className="movies_header">Movies showing in {location}</h1>

          <div className="user_buttons">
            <div className="user_public_buttons">
              <Button variant="primary" onClick={toSearch}>
                Search Movies
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                variant="info"
                onClick={() => nav("/locations")}
              >
                View Locations
              </Button>
            </div>
            {isAdmin && (
              <div className="user_admin_buttons">
                <AddMovie location={location} />
                <Button variant="success" onClick={toUpdateTheaters}>
                  Update Theaters
                </Button>
              </div>
            )}
            <div className="user_logout_button">
              <Logout />
            </div>
          </div>

          <h3 className="movies_header">
            <Form>
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
                  <option key={idx} value={display}>
                    {display}
                  </option>
                ))}
              </Form.Select>
            </Form>
          </h3>

          <div className="movie_grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie_item">
                <div onClick={() => toggleMovieDetails(movie.id)}>
                  <MoviePoster movie_id={movie.id} />
                  <p
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    className="movie_title"
                  >
                    {movie.title}
                  </p>
                </div>

                {openMovieId === movie.id && (
                  <div className="movie_details" style={{ marginLeft: "20px" }}>
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
                      {isAdmin && (
                        <AddPoster
                          className="movie_buttons"
                          movie_id={movie.id}
                          movie_title={movie.title}
                        />
                      )}
                      {theaterMovieIds.includes(movie.id) && (
                        <div className="movie_buttons_flex">
                          <PurchaseTickets
                            className="movie_buttons"
                            movie={movie}
                            location={location}
                            refreshTickets={refreshTickets}
                            showTimes={getShowTimes(movie)}
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
