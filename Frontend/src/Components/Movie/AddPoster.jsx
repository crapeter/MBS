import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

const AddPoster = ({ movie_id, movie_title }) => {
  const [show, setShow] = useState(false);
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handlePoster = (e) => {
    if (e.target.files.length === 0) {
      return;
    }
    setPoster(e.target.files[0]);
  };

  const addPoster = async () => {
    if (!poster) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("poster", poster);
    formData.append("movieId", movie_id);
    formData.append("title", movie_title);

    setLoading(true);

    try {
      await axios.post(`/api/posters/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="add_poster_div">
      <Button variant="primary" onClick={handleShow}>
        Add Poster
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Poster</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                type="file"
                id="poster"
                label="Select a poster"
                onChange={handlePoster}
              />
            </Form.Group>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="success" onClick={addPoster} disabled={loading}>
                {loading ? "Uploading..." : "Add Poster"}
              </Button>
              <Button variant="danger" onClick={handleClose}>
                Close
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddPoster;
