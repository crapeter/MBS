import React, { useEffect, useState } from "react";
import axios from "axios";

const MoviePoster = ({ movie_id }) => {
  const [poster, setPoster] = useState("");

  useEffect(() => {
    getMoviePoster(movie_id);
  }, [movie_id]);

  const getMoviePoster = async (movie_id) => {
    try {
      const response = await axios.get(`/api/posters/get/${movie_id}`);
      setPoster(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <img
        src={`data:image/jpeg;base64,${poster}`}
        alt="Movie Poster"
        style={{ width: "300px", height: "450px" }}
      />
    </div>
  );
};

export default MoviePoster;
