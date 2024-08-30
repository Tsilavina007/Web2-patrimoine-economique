import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ show, handleClose, selectedPerson, handleDelete }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir supprimer {selectedPerson ? selectedPerson.name : ''} et toutes ses possessions ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={() => handleDelete(selectedPerson)}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
