import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ToTicketDisplay = () => {
  const nav = useNavigate();

  return (
    <div>
      <Button variant="primary" onClick={() => nav("/Tickets")}>
        View Tickets
      </Button>
    </div>
  );
};

export default ToTicketDisplay;
