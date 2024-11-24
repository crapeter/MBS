import React, { useEffect, useState } from "react";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import AddPoster from "./AddPoster";
import AddMovie from "./AddMovie";
import EditPrice from "./EditPrice";
import DeleteMovie from "./DeleteMovie";
import axios from "axios";
import "../../CSS/AdminPage.css";

const AdminPage = () => {
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

  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [soldByLocation, setSoldByLocation] = useState({});
  const [breakdowns, setBreakdowns] = useState({});
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [openMovieId, setOpenMovieId] = useState(null);
  const [pageUpdated, setPageUpdated] = useState(false);
  const [moviePosterCache, setMoviePosterCache] = useState({});
  const [postersLoading, setPostersLoading] = useState(true);
  const [isTheaterInfoHidden, setIsTheaterInfoHidden] = useState(false);
  const [isCatalogHidden, setIsCatalogHidden] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const [totalTickets, posters] = await Promise.all([
        axios.get("/api/tickets/number/sold"),
        axios.get("/api/posters/get"),
      ]);

      const posterCache = posters.data.reduce((acc, poster) => {
        setTotalTicketsSold(totalTickets.data);

        acc[poster.movieId] = poster.image;
        return acc;
      }, {});
      setMoviePosterCache(posterCache);

      // Fetch location-specific data
      const [locationsData, breakdownsData] = await Promise.all([
        Promise.all(
          locations.map((location) =>
            axios.get(`/api/tickets/number/sold/${location}`)
          )
        ),
        Promise.all(
          locations.map((location) =>
            axios.get(`/api/tickets/theater/breakdown/${location}`)
          )
        ),
      ]);

      // Process locations data
      const soldByLocationData = {};
      locations.forEach((location, index) => {
        soldByLocationData[location] = locationsData[index].data;
      });
      setSoldByLocation(soldByLocationData);

      // Process breakdown data
      const breakdownsDataProcessed = {};
      locations.forEach((location, index) => {
        breakdownsDataProcessed[location] = breakdownsData[index].data;
      });
      setBreakdowns(breakdownsDataProcessed);

      setPostersLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Error fetching data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/api/movies/all");
        setMovies(response.data);
        setAllMovies(response.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
    // eslint-disable-next-line
  }, [pageUpdated]);

  useEffect(() => {
    const filterMovies = () => {
      const filteredMovies = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      );
      setMovies(filteredMovies);
    };

    filterMovies();
  }, [search, allMovies]);

  const combineDuplicateMovies = (breakdowns) => {
    const uniqueData = {};

    for (const [location, theaters] of Object.entries(breakdowns)) {
      const movieMap = new Map();

      for (const { movieTitle, numberPurchased } of Object.values(theaters)) {
        const currentCount = movieMap.get(movieTitle) || 0;
        movieMap.set(movieTitle, currentCount + numberPurchased);
      }

      uniqueData[location] = Object.fromEntries(
        [...movieMap.entries()].sort(([a], [b]) => a.localeCompare(b))
      );
    }

    return uniqueData;
  };

  const togglePriceUpdated = () => setPageUpdated((prev) => !prev);

  const toggleMovieDetails = (movieId) =>
    setOpenMovieId((prev) => (prev === movieId ? null : movieId));

  const formatPrice = (price) =>
    price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const toggleTheaterInfo = () => setIsTheaterInfoHidden((prev) => !prev);

  const toggleCatalog = () => setIsCatalogHidden((prev) => !prev);

  const goBack = () => nav(-1);

  return isLoggedIn && isAdmin ? (
    <div className="top_admin_page_div">
      <div className="total_tickets_sold">
        <h1 className="title" style={{ color: "white" }}>
          The total number of tickets sold is: {totalTicketsSold}
        </h1>

        <div className="admin_button_div">
          <Button
            variant="primary"
            className="backButton"
            onClick={() => goBack()}
          >
            Return
          </Button>

          <Button variant="danger" onClick={toggleTheaterInfo}>
            {isTheaterInfoHidden ? "Show Theater Info" : "Hide Theater Info"}
          </Button>

          <Button variant="danger" onClick={toggleCatalog}>
            {isCatalogHidden ? "Show Current Catalog" : "Hide Current Catalog"}
          </Button>

          <AddMovie togglePageUpdate={togglePriceUpdated} />
        </div>
      </div>

      <div className="admin_info_container">
        {isTheaterInfoHidden ? (
          <div></div>
        ) : (
          <div className="tickets_sold_info">
            {Object.keys(breakdowns).length !== 6 ? (
              <div className="admin_spinner_container">
                <p className="admin_loading_movies">Loading Theater Info</p>
                <p className="admin_spinner"></p>
              </div>
            ) : (
              Object.entries(combineDuplicateMovies(breakdowns)).map(
                ([location, movies]) => (
                  <div key={location} className="movie_breakdown">
                    {soldByLocation[location] === 1 ? (
                      <div>
                        <h2 className="title">{location}:</h2>
                        <h3>{soldByLocation[location]} ticket sold</h3>
                      </div>
                    ) : (
                      <h2 className="title">
                        <div>
                          <h2 className="title">{location}:</h2>
                          <h3>{soldByLocation[location]} tickets sold</h3>
                        </div>
                      </h2>
                    )}
                    {Object.keys(movies).length === 0 ? (
                      <p>No tickets sold.</p>
                    ) : (
                      <div>
                        <h5>{location} Breakdown:</h5>
                        <ul>
                          {Object.entries(movies).map(
                            ([movieTitle, ticketsSold]) => (
                              <li key={movieTitle}>
                                {movieTitle}: {ticketsSold} tickets sold
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              )
            )}
          </div>
        )}

        {isCatalogHidden ? (
          <div></div>
        ) : (
          <div className="admin_movie_div">
            <input
              value={search}
              type="text"
              placeholder="Search for a movie"
              onChange={(e) => setSearch(e.target.value)}
              className="admin_search_input"
            />
            <div className="admin_movie_grid">
              {movies.map((movie) => (
                <div key={movie.id} className="movie_item">
                  <div onClick={() => toggleMovieDetails(movie.id)}>
                    {postersLoading ? (
                      <div className="admin_movie_spinner_container">
                        <p style={{ color: "white" }}>Loading Movie Poster</p>
                        <p className="admin_movie_spinner"></p>
                      </div>
                    ) : (
                      <img
                        loading="lazy"
                        src={`data:image/jpeg;base64,${
                          moviePosterCache[movie.id]
                        }`}
                        alt="Movie Poster"
                        style={{ width: "300px", height: "450px" }}
                      />
                    )}
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
                      <div className="admin_movie_buttons">
                        <AddPoster
                          className="movie_buttons"
                          movie_id={movie.id}
                          movie_title={movie.title}
                        />
                        <EditPrice
                          movie={movie}
                          togglePageUpdate={togglePriceUpdated}
                        />
                        <DeleteMovie
                          movieId={movie.id}
                          togglePageUpdate={togglePriceUpdated}
                        />
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
      <h1 className="warning" style={{ color: "white" }}>
        Status report only available to admins
      </h1>
    </div>
  );
};

export default AdminPage;
