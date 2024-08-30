import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ show, handleClose, name,selectedPersonPossessions,selectedPatrimoinesId, possession, handleDelete }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir supprimer la possession {possession.libelle} de {name}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={() => handleDelete(selectedPersonPossessions, selectedPatrimoinesId, possession)}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
