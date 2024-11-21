import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../../CSS/HomePage.css";
import axios from "axios";

const HomePage = () => {
  const nav = useNavigate();

  const [movies, setMovies] = useState([]);
  const [openMovieId, setOpenMovieId] = useState(null);
  const [viewCurrentCatalog, setViewCurrentCatalog] = useState(false);
  const [moviePosterCache, setMoviePosterCache] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      getMovies();
      getMoviePoster();
    } catch (err) {
      alert(err);
    }
    // eslint-disable-next-line
  }, []);

  const getMovies = async () => {
    try {
      const allMovies = await axios.get("/api/movies/all");
      const sortedMovies = allMovies.data.sort((a, b) => {
        return a.title > b.title ? 1 : -1;
      });
      setMovies(sortedMovies);
    } catch (err) {
      alert(err.message);
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie posters:", error);
    }
  };

  const toggleMovieDetails = (movieId) => {
    setOpenMovieId(openMovieId === movieId ? null : movieId);
  };

  const toggleCurrentCatalog = () => {
    setViewCurrentCatalog(!viewCurrentCatalog);
  };

  const toReviews = (movie) => {
    nav(`/${movie.title}/reviews`);
  };

  return (
    <div className="home_page_div">
      <div className="home_page_container">
        <div className="login_button_home">
          <Button
            className="to_login_page"
            variant="danger"
            onClick={() => nav("/login")}
          >
            Login
          </Button>
        </div>
        <div className="home_page_header">
          <div className="text_container">
            <h1>Welcome to our Movie Booking System</h1>
            <p className="home_page_intro">
              Discover a seamless way to explore, view, and book tickets for the
              latest movies. Our platform is designed to bring you an easy,
              fast, and enjoyable booking experience. Dive into a world of
              movies, from the latest releases to timeless classics, and explore
              detailed movie information, all in one place!
            </p>
          </div>
        </div>

        <div className="home_page_info">
          <h2>What You Can Do:</h2>
          <ul className="home_page_features">
            <li>
              Browse our extensive catalog of current movies showing near you.
            </li>
            <li>
              Get in-depth details about each movie, including genre, runtime,
              cast, and more.
            </li>
            <li>
              Read reviews from other moviegoers to help you decide what to
              watch next.
            </li>
            <li>Effortlessly book tickets for upcoming shows.</li>
          </ul>
        </div>

        {loading ? (
          <button className="view_home_page_catalog">Loading Movies</button>
        ) : (
          <button
            className="view_home_page_catalog"
            onClick={toggleCurrentCatalog}
          >
            View Current Movie Catalog
          </button>
        )}

        {viewCurrentCatalog && (
          <div className="movie_grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie_item">
                <div onClick={() => toggleMovieDetails(movie.id)}>
                  <img
                    src={`data:image/jpeg;base64,${moviePosterCache[movie.id]}`}
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
                    style={{ marginLeft: "20px", border: "2px solid black" }}
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
