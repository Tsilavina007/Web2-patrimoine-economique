import React from 'react';
import { Modal, Button, Table, Card, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


import Argent from '../../../../models/possessions/Argent.js';
import BienMateriel from '../../../../models/possessions/BienMateriel.js';
import Flux from '../../../../models/possessions/Flux.js';
import Possession from '../../../../models/possessions/Possession.js';
import Patrimoine from '../../../../models/Patrimoine.js';
import Personne from '../../../../models/Personne.js';


const getDateFin = (dateDebut, amortissement) => {
  const yearsToZero = 100 / amortissement;
  const newDateDebut = new Date(dateDebut);
  return new Date(newDateDebut.setFullYear(newDateDebut.getFullYear() + yearsToZero));
};

const calculateCurrentValue = (possession, calculateDate) => {
  const now = new Date(calculateDate);
  const start = new Date(possession.startDate);

  const TYPE_ARGENT = {
    Courant: "Courant",
    Epargne: "Epargne",
    Espece: "Espece"
  };

  let currentValue = possession.amount;

  // Appliquer l'ajustement selon le type de possession
  switch (possession.type) {
    case 'Argent':
      if (possession.typeArgent === 'Epargne') {
        // Calculer les intérêts composés annuels
        const savingsAccount = new Argent(
          "Ilo", 
          possession.libelle, 
          possession.amount, 
          start, 
          null, 
          -possession.interestRate,
        TYPE_ARGENT.Epargne);

        currentValue = savingsAccount.getValeur(now);


      } else if (possession.typeArgent === 'Courant') {
        
        const salary = new Flux(
          "Ilo", 
          possession.libelle, 
          possession.constAmount, 
          start, 
          null, 
          0, 
          possession.getAmountDate);

        currentValue = salary.getValeur(now);
      }
      break;

    case 'Materiel':
      // Calculer la dépréciation pour chaque année entière
      const materiel = new Possession(
        "Ilo", 
        possession.libelle, 
        possession.amount, 
        start, 
        null, 
        possession.depreciationRate);
        currentValue = materiel.getValeur(now);

      break;

    case 'TrainDeVie':
      const survie = new Flux(
        "Ilo", 
        possession.libelle, 
        possession.constAmount, 
        start, 
        null, 
        0, 
        possession.getAmountDate);

      currentValue = survie.getValeur(now);
      break;

    default:
      currentValue = possession.constAmount;
      break;
  }

  // Arrondir la valeur actuelle à 2 décimales
  return Number(currentValue.toFixed(2));
};

const calculatePatrimoineValue = (possessions, getPatrimoineDate) => {
  let patrimoineValue = 0
  possessions.forEach(possession => {
    switch (possession.type) {
      case "TrainDeVie":
        patrimoineValue -= calculateCurrentValue(possession, getPatrimoineDate);
        break;
    
      default:
        patrimoineValue += calculateCurrentValue(possession, getPatrimoineDate);
        break;
    }
  });
  return patrimoineValue.toFixed(2);
}

const ShowPossessionsModal = ({selectedPersonPossessions, getPatrimoineDate, setGetPatrimoineDate, sumPatrimoine, setSumPatrimoine }) => (
    <>
      <Row className="mt-5">
        <Col className="d-flex justify-content-center">
          <Card className="modal-content-full-width">
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Libelle</th>
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
                      <td>{possession.constAmount}</td>
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
                        {possession.type === 'Argent' && possession.typeArgent === 'Epargne'
                          ? `${possession.interestRate} %`
                          : possession.type === 'Materiel'
                          ? `${possession.depreciationRate} %`
                          : ''}
                      </td>
                      <td>
                        {calculateCurrentValue(possession, new Date())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-start m-4" style={{width:'100%'}}>
        <Col md={8} className="text-start">
          <Card className="card-custom">
            <Card.Body>
            <Card.Title className="card-text-custom">
                  Calcul Patrimoine
            </Card.Title>

            <Card.Text className="card-text-custom">
                    Patrimoine le : 
            </Card.Text>
            <DatePicker
                          selected={getPatrimoineDate}
                          onChange={(getPatrimoineDate) => setGetPatrimoineDate(getPatrimoineDate)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                        />

            <Card.Text className="card-text-custom">
             =  {sumPatrimoine}
            </Card.Text>

              <Button variant="primary" className="btn-custom" onClick={() => {setSumPatrimoine(calculatePatrimoineValue(selectedPersonPossessions, getPatrimoineDate))}}>
                Valider
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
);

export default ShowPossessionsModal;
