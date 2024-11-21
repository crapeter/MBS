import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom";
import AddPoster from "./AddPoster";
import AddMovie from "./AddMovie";
import EditPrice from "./EditPrice";
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
  const [priceUpdated, setPriceUpdated] = useState(false);
  const [moviePosterCache, setMoviePosterCache] = useState({});
  const [postersLoading, setPostersLoading] = useState(true);
  const [isTheaterInfoHidden, setIsTheaterInfoHidden] = useState(false);
  const [isCatalogHidden, setIsCatalogHidden] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTotalTicketsSold();
        await getMoviePoster();

        const fetchLocations = locations.map((location) =>
          getTicketsSoldByLocation(location)
        );
        const fetchBreakdowns = locations.map((location) =>
          getBreakdown(location)
        );

        await Promise.all([...fetchLocations, ...fetchBreakdowns]);
      } catch (err) {
        alert(err);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterMovie();
    // eslint-disable-next-line
  }, [search]);

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

  const toggleMovieDetails = (movieId) => {
    setOpenMovieId(openMovieId === movieId ? null : movieId);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const toggleTheaterInfo = () => {
    setIsTheaterInfoHidden((prev) => !prev);
  };

  const toggleCatalog = () => {
    setIsCatalogHidden((prev) => !prev);
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
    setMovies(movies);
  };

  const getOnlyMovies = async () => {
    try {
      const allMovies = await axios.get("/api/movies/all");
      setMovies(allMovies.data.sort((a, b) => (a.title > b.title ? 1 : -1)));
      setAllMovies(allMovies.data.sort((a, b) => (a.title > b.title ? 1 : -1)));
    } catch (err) {
      alert(err.message);
    }
  };

  const getTotalTicketsSold = async () => {
    try {
      const res = await axios.get("/api/tickets/number/sold");
      setTotalTicketsSold(res.data);
    } catch (error) {
      console.err(error);
    }
  };

  const getTicketsSoldByLocation = async (location) => {
    try {
      const res = await axios.get(`/api/tickets/number/sold/${location}`);
      setSoldByLocation((prev) => ({
        ...prev,
        [location]: res.data,
      }));
    } catch (error) {
      console.err(error);
    }
  };

  const getBreakdown = async (location) => {
    try {
      const res = await axios.get(`/api/tickets/theater/breakdown/${location}`);
      setBreakdowns((prev) => ({
        ...prev,
        [location]: res.data,
      }));
    } catch (error) {
      console.err(error);
    }
  };

  const combineDuplicateMovies = (breakdowns) => {
    const uniqueData = {};

    Object.keys(breakdowns).forEach((location) => {
      uniqueData[location] = {};

      Object.values(breakdowns[location]).forEach((theaterData) => {
        const { movieTitle, numberPurchased } = theaterData;

        if (!uniqueData[location][movieTitle]) {
          uniqueData[location][movieTitle] = 0;
        }
        uniqueData[location][movieTitle] += numberPurchased;
      });

      uniqueData[location] = Object.entries(uniqueData[location])
        .sort(([a], [b]) => a.localeCompare(b))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    });

    return uniqueData;
  };

  const goBack = () => {
    nav(-1);
  };

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
            Go Back
          </Button>

          <Button variant="danger" onClick={toggleTheaterInfo}>
            {isTheaterInfoHidden ? "Show Theater Info" : "Hide Theater Info"}
          </Button>

          <Button variant="danger" onClick={toggleCatalog}>
            {isCatalogHidden ? "Show Current Catalog" : "Hide Current Catalog"}
          </Button>

          <AddMovie location={""} />
        </div>
      </div>

      <div className="admin_info_container">
        {isTheaterInfoHidden ? (
          <div></div>
        ) : (
          <div className="tickets_sold_info">
            {Object.keys(breakdowns).length === 0 ? (
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
