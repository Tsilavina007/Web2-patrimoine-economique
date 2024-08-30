import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddPossessionModal = ({
  show,
  handleClose,
  type,
  setType,
  typeArgent,
  setTypeArgent,
  libelle,
  setLibelle,
  amount,
  setAmount,
  startDate,
  setStartDate,
  interestRate,
  setInterestRate,
  depreciationRate,
  setDepreciationRate,
  getAmountDate,
  setGetAmountDate,
  handleAddPossession
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une Possession</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPossessionType">
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Argent</option>
              <option>Materiel</option>
              <option>TrainDeVie</option>
            </Form.Control>
          </Form.Group>
          {type === 'Argent' && (
          <Form.Group controlId="formPossessionTypeArgent" className="mt-3">
            <Form.Label>Type Argent</Form.Label>
              <Form.Control
                as="select"
                value={typeArgent}
                placeholder="type Argent"
                onChange={(e) => setTypeArgent(e.target.value)}
              >
                <option>Type Argent</option>
                <option>Especes</option>
                <option>Courant</option>
                <option>Epargne</option>
              </Form.Control>
          </Form.Group>

            )}
          <Form.Group controlId="formPossessionName" className="mt-3">

            <Form.Label>Libelle</Form.Label>
              <Form.Control
                type="text"
                placeholder="Libelle de la possession"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
              />
          
          </Form.Group>
          <Form.Group controlId="formPossessionAmount" className="mt-3">
            <Form.Label>Montant</Form.Label>
            <Form.Control
              type="number"
              placeholder="Montant"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </Form.Group>
          <Form.Group controlId="formDateDebut" className="mt-3">
            <Form.Label>Date de Début</Form.Label>
            <div>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
              />
            </div>
          </Form.Group>
          {type === 'Argent' && libelle === 'Epargne' &&(
            <Form.Group controlId="formInterestRate" className="mt-3">
              <Form.Label>Taux d'Intérêt</Form.Label>
              <Form.Control
                type="number"
                placeholder="Taux d'Intérêt"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              />
            </Form.Group>
          )}
          {type === 'Materiel' && (
            <Form.Group controlId="formDepreciationRate" className="mt-3">
              <Form.Label>Taux de Dépréciation</Form.Label>
              <Form.Control
                type="number"
                placeholder="Taux de Dépréciation"
                value={depreciationRate}
                onChange={(e) => setDepreciationRate(parseFloat(e.target.value))}
              />
            </Form.Group>
          )}
          {((type=== "Argent" && typeArgent === "Courant") || type === "TrainDeVie") && (
            <Form.Group controlId="formGetAmountDate" className="mt-3">
                <Form.Label>Jour</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Jour"
                  value={getAmountDate}
                  onChange={(e) => setGetAmountDate(parseFloat(e.target.value))}
                />
              </Form.Group>
          )}
          <Button variant="primary" onClick={handleAddPossession} className="mt-3">
            Ajouter Possession
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPossessionModal;
