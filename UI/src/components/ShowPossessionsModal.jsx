import React from 'react';
import { Modal, Button, Table, Card, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const getDateFin = (dateDebut, amortissement) => {
  const yearsToZero = 100 / amortissement;
  const newDateDebut = new Date(dateDebut);
  return new Date(newDateDebut.setFullYear(newDateDebut.getFullYear() + yearsToZero));
};

const calculateCurrentValue = (possession) => {
  const now = new Date();
  const start = new Date(possession.startDate);

  // Calculer la différence en années complètes
  let diffYearsDefault = now.getFullYear() - start.getFullYear();
  let diffYears = diffYearsDefault;
  let diffMonth = now.getMonth() - start.getMonth() +1;
  if (now.getMonth() < start.getMonth() || 
      (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
    diffYears--;
  }

  if (now.getMonth() <= start.getMonth() && diffYearsDefault > 0 ){
    diffMonth = (diffYearsDefault*12) + start.getMonth() - now.getMonth();
  } else if (now.getMonth() > start.getMonth() && (diffYearsDefault) > 0 ){
    diffMonth = ((diffYearsDefault) * 12) -now.getMonth()+ start.getMonth() ;
  }

  let currentValue = possession.amount;

  // Appliquer l'ajustement selon le type de possession
  switch (possession.type) {
    case 'Argent':
      if (possession.libelle === 'Epargne') {
        // Calculer les intérêts composés annuels
        currentValue = possession.amount + (possession.amount * diffYears * (possession.interestRate / 100));
      } else if (possession.libelle === 'Courant') {
        currentValue = possession.amount * diffMonth ;
      }
      break;

    case 'Materiel':
      // Calculer la dépréciation pour chaque année entière
      currentValue = possession.amount - (possession.amount * diffYears * (possession.depreciationRate / 100));
      break;

    case 'TrainDeVie':
      currentValue = possession.amount;
      break;

    default:
      currentValue = possession.amount;
      break;
  }

  // Arrondir la valeur actuelle à 2 décimales
  return Number(currentValue.toFixed(2));
};


const ShowPossessionsModal = ({ show, handleClose, selectedPerson, selectedPersonPossessions }) => (
  <Modal show={show} onHide={handleClose} dialogClassName="modal-full-width">
    <Modal.Header closeButton>
      <Modal.Title>Possessions de {selectedPerson}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="modal-body-full-width">
      <Row className="mt-5">
        <Col className="d-flex justify-content-center">
          <Card className="modal-content-full-width">
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Possession</th>
                    <th>Valeur initiale</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                    <th>Intérêt / Amortissement</th>
                    <th>Valeur actuelle</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPersonPossessions.map((possession, index) => (
                    <tr key={index}>
                      <td>{possession.libelle}</td>
                      <td>{possession.amount}</td>
                      <td>
                        <DatePicker
                          selected={new Date(possession.startDate)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          disabled
                        />
                      </td>
                      {possession.type === "Materiel" ? (
                        <td>
                          <DatePicker
                            selected={new Date(getDateFin(possession.startDate, possession.depreciationRate))}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            disabled
                          />
                        </td>
                      ) : (
                        <td></td>
                      )}
                      <td>
                        {possession.type === 'Argent' && possession.libelle === 'Epargne'
                          ? `${possession.interestRate} %`
                          : possession.type === 'Materiel'
                          ? `${possession.depreciationRate} %`
                          : ''}
                      </td>
                      <td>
                        {calculateCurrentValue(possession)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-start m-4" style={{width:'40%'}}>
        <Col md={8} className="text-start">
          <Card className="card-custom">
            <Card.Body>
            <Card.Text className="card-text-custom">
                  Projection Patrimoine
            </Card.Text>

            <Card.Text className="card-text-custom">
              <DatePicker
                selected={new Date()}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                />
            </Card.Text>
              <Button variant="primary" className="btn-custom" onClick={() => {}}>
                Valider
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>


    </Modal.Body>
  </Modal>
);

export default ShowPossessionsModal;
