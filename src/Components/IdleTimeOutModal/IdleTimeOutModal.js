import React from "react";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "./IdleTimeOutModal.css";

export const IdleTimeOutModal = ({
  showModal,
  handleClose,
  handleLogout,
  remainingTime,
}) => {
  return (
    <div className="idleTimeOutModal">
      <Modal show={showModal} onHide={handleClose}>
        <div className="close-container">
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="main-content-container">
          <Modal.Header>
            <Modal.Title>You Have Been Idle!</Modal.Title>
          </Modal.Header>
          <Modal.Body>You Will Get Timed Out. You want to stay?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Stay
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};
