import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import "../../CSS/AddMovie.css";

const AddMovie = ({ location }) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [runTime, setRunTime] = useState("");
  const [showTime, setShowTime] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [director, setDirector] = useState("");
  const [cast, setCast] = useState("");
  const [price, setPrice] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addNewMovie = async () => {
    if (
      title === "" ||
      description === "" ||
      genre === "" ||
      runTime === "" ||
      showTime === "" ||
      releaseDate === "" ||
      director === "" ||
      cast === "" ||
      price === ""
    ) {
      alert("Please fill out all fields");
      return;
    }

    let priceNum;
    try {
      priceNum = parseFloat(price);
    } catch (err) {
      alert("Price must be a number");
      return;
    }

    try {
      await axios.post("/api/movies/new/movie", {
        title: title,
        description: description,
        genre: genre,
        runTime: runTime,
        showTime: showTime,
        releaseDate: releaseDate,
        director: director,
        cast: cast,
        isPlaying: true,
        price: priceNum,
      });
      handleClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <Button variant="success" onClick={handleShow}>
        Add New Movie
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Movie</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicTitle">
              <Form.Control
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicDescription">
              <Form.Control
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicGenre">
              <Form.Control
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicRunTime">
              <Form.Control
                type="text"
                placeholder="Run Time"
                value={runTime}
                onChange={(e) => setRunTime(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicShowTime">
              <Form.Control
                type="text"
                placeholder="Show Time"
                value={showTime}
                onChange={(e) => setShowTime(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicReleaseDate">
              <Form.Control
                type="text"
                placeholder="Release Date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicDirector">
              <Form.Control
                type="text"
                placeholder="Director"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicCast">
              <Form.Control
                type="text"
                placeholder="Cast"
                value={cast}
                onChange={(e) => setCast(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPrice">
              <Form.Control
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" onClick={addNewMovie}>
              Add Movie
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddMovie;
