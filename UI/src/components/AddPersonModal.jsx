import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddPersonModal = ({ show, handleClose, newPersonName, setNewPersonName, handleAddPerson }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une Personne</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPersonName">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrer le nom"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddPerson} className="mt-3">
            Ajouter Personne
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPersonModal;
