import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

const DeleteMovie = ({ movieId, togglePageUpdate }) => {
  const deleteMovie = async (movieId) => {
    try {
      await axios.delete(`/api/movies/${movieId}`);
      togglePageUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button variant="danger" onClick={() => deleteMovie(movieId)}>
      Delete
    </Button>
  );
};

export default DeleteMovie;
