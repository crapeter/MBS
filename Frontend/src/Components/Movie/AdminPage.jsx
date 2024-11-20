import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom";
import MoviePoster from "./MoviePoster";
import AddPoster from "./AddPoster";
import AddMovie from "./AddMovie";
import EditPrice from "./EditPrice";
import axios from "axios";
import "../../CSS/AdminPage.css";

const StatusReport = () => {
  const locations = [
    "Lubbock",
    "Amarillo",
    "Levelland",
    "Plainview",
    "Snyder",
    "Abilene",
  ];
  const nav = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [playingMovies, setPlayingMovies] = useState([]);
  const [movieCache, setMovieCache] = useState({});
  const [ticketCache, setTicketCache] = useState({});
  const [ticketsByLocation, setTicketsByLocation] = useState({});
  const [tickets, setTickets] = useState([]);

  const [movies, setMovies] = useState([]);
  const [openMovieId, setOpenMovieId] = useState(null);
  const [priceUpdated, setPriceUpdated] = useState(false);

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getOnlyMovies();
    // eslint-disable-next-line
  }, [priceUpdated]);

  const refresh = () => {
    window.location.reload();
  };

  const togglePriceUpdated = () => {
    setPriceUpdated((prev) => !prev);
  };

  const fetchInitialData = async () => {
    try {
      await getAllTickets();
      await Promise.all(
        locations.map(async (loc) => {
          await getTicketsByLocation(loc);
          await getTickets(loc);
          await getMovies(loc);
        })
      );
      setLoading(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const getAllTickets = async () => {
    try {
      const response = await axios.get("/api/tickets/all");
      const numSold = parseInt(
        response.data.slice(response.data.indexOf(":") + 1).trim()
      );
      setTicketsSold(numSold);
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleMovies = (location) => {
    setSelectedLocation(selectedLocation === location ? "" : location);
  };

  const goBack = () => {
    nav(-1);
  };

  const getOnlyMovies = async () => {
    try {
      const allMovies = await axios.get("/api/movies/all");
      setMovies(allMovies.data.sort((a, b) => (a.title > b.title ? 1 : -1)));
    } catch (err) {
      alert(err.message);
    }
  };

  const getMovies = async (location) => {
    if (movieCache[location]) {
      setPlayingMovies(movieCache[location]);
      return;
    }
    try {
      const [allMoviesResponse, locationTheatersResponse] = await Promise.all([
        axios.get("/api/movies/all"),
        axios.get(`/api/theaters/get/by/location?location=${location}`),
      ]);

      const allMovies = allMoviesResponse.data;
      const locationTheaters = locationTheatersResponse.data;

      setMovies(allMovies.sort((a, b) => (a.title > b.title ? 1 : -1)));

      const theaterIds = locationTheaters.flatMap(
        (theater) => theater.movieIds
      );
      const playingMovies = allMovies.filter((movie) =>
        theaterIds.includes(movie.id)
      );

      playingMovies.sort((a, b) => (a.title > b.title ? 1 : -1));
      setPlayingMovies(playingMovies);
      setMovieCache((prevCache) => ({
        ...prevCache,
        [location]: playingMovies,
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const getTicketsByLocation = async (location) => {
    try {
      const response = await axios.get(
        `/api/tickets/location/total?location=${location}`
      );
      setTicketsByLocation((prev) => ({ ...prev, [location]: response.data }));
    } catch (err) {
      alert(err.message);
    }
  };

  const getTickets = async (location) => {
    if (ticketCache[location]) {
      setTickets(ticketCache[location]);
      return;
    }
    try {
      const response = await axios.get(
        `/api/tickets/location?location=${location}`
      );
      setTickets(response.data);
      setTicketCache((prevCache) => ({
        ...prevCache,
        [location]: response.data,
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const getTicketsByMovie = (movieId) => {
    return tickets
      .filter((ticket) => ticket.movieId === movieId)
      .reduce((acc, ticket) => acc + ticket.numberPurchased, 0);
  };

  const toggleMovieDetails = (movieId) => {
    setOpenMovieId(openMovieId === movieId ? null : movieId);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="top_admin_page_div">
      {isLoggedIn && isAdmin ? (
        <div className="status_report_container_sr">
          <div className="status_report_div">
            <div className="status_container">
              <h1 className="tickets_sold">
                The total number of tickets sold between all theaters is:{" "}
                {ticketsSold}
              </h1>
              <Button
                className="status_report_button_sr"
                variant="danger"
                onClick={goBack}
                style={{ maxWidth: "300px" }}
              >
                Return
              </Button>
            </div>
            {loading ? (
              <div className="loading_div">
                <p className="loading_text">
                  <span>L</span>
                  <span>o</span>
                  <span>a</span>
                  <span>d</span>
                  <span>i</span>
                  <span>n</span>
                  <span>g</span>
                </p>
                <p className="spinner"></p>
              </div>
            ) : (
              <ul className="location_list_sr">
                {locations.map((location, index) => (
                  <li key={index}>
                    <h3
                      className="location_name_sr"
                      onClick={() => {
                        getMovies(location);
                        getTickets(location);
                        toggleMovies(location);
                      }}
                      style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      {location} has sold {ticketsByLocation[location] || 0}{" "}
                      tickets
                    </h3>

                    {selectedLocation === location && (
                      <div className="location_info_sr">
                        <p className="current_movie_p_tag">
                          Current movies playing at {location}:
                        </p>
                        {playingMovies.map((movie, idx) => (
                          <div key={idx} className="movies_playing_at_loc_sr">
                            <p className="status_movie_info">
                              {movie.title} has{" "}
                              {getTicketsByMovie(movie.id) || 0} tickets
                              purchased
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div className="user_admin_buttons">
              <AddMovie location={""} />
            </div>
          </div>
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
                  <div
                    className="movie_details"
                    style={{ marginLeft: "20px", border: "2px solid black" }}
                  >
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
                    <div>
                      <AddPoster
                        className="movie_buttons"
                        movie_id={movie.id}
                        movie_title={movie.title}
                        refresh={refresh}
                      />
                      <EditPrice
                        movie={movie}
                        togglePageUpdate={togglePriceUpdated}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1 className="warning" style={{ color: "white" }}>
            Status report only available to admins
          </h1>
        </div>
      )}
    </div>
  );
};

export default StatusReport;
