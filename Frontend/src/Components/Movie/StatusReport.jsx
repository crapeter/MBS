import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../CSS/StatusReport.css";

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
  const [ticketCache, setTicketCache] = useState({}); // Cache for tickets by location
  const [ticketsByLocation, setTicketsByLocation] = useState({});
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line
  }, []);

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
    nav("/locations");
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

  return (
    <div>
      {isLoggedIn && isAdmin ? (
        <div className="status_report_container_sr">
          <div className="status_report_div">
            <Button
              className="status_report_button_sr"
              variant="danger"
              onClick={goBack}
            >
              Return
            </Button>
            <p className="tickets_sold">
              The total number of tickets sold between all theaters is:{" "}
              {ticketsSold}
            </p>
            {loading ? (
              <p className="spinner"></p>
            ) : (
              <ul className="location_list_sr">
                {locations.map((location, index) => (
                  <li key={index}>
                    <h3
                      onClick={() => {
                        getMovies(location);
                        getTickets(location);
                        toggleMovies(location);
                      }}
                      style={{ cursor: "pointer", fontWeight: "bold" }}
                    >
                      {location} has sold {ticketsByLocation[location] || 0}{" "}
                      tickets
                    </h3>

                    {selectedLocation === location && (
                      <div className="location_info_sr">
                        <p className="current_movie_p_tag">Current movies:</p>
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
