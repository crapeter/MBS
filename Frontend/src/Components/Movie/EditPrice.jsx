import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import "../../CSS/AddMovie.css";

const EditPrice = ({ movie, togglePageUpdate }) => {
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updatePrice = async () => {
    if (price === "") {
      alert("Please fill out the price field");
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
      await axios.patch(
        `/api/movies/update/price?movieId=${movie.id}&newPrice=${priceNum}`
      );
      handleClose();
      togglePageUpdate();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <Button variant="success" onClick={handleShow}>
        Update Price
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit price of {movie.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicPrice">
              <Form.Control
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" onClick={updatePrice}>
              Update Price
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditPrice;
