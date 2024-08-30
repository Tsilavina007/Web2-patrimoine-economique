import React from 'react';
import {Button, Table, Card, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';


import Argent from '../../../models/possessions/Argent.js';
import BienMateriel from '../../../models/possessions/BienMateriel.js';
import Flux from '../../../models/possessions/Flux.js';
import Possession from '../../../models/possessions/Possession.js';
import Patrimoine from '../../../models/Patrimoine.js';
import Personne from '../../../models/Personne.js';


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

        if (currentValue <= 0) {
            currentValue = 0
        }

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



const ShowPossessionsModal = ({ people, patrimoines, handleShowAddPossession}) => {

  const [sumPatrimoine, setSumPatrimoine] = useState(0);
  const [getPatrimoineDate, setGetPatrimoineDate] = useState(new Date());

  const navigate = useNavigate();

  const handleEdit = (libelle) => {
    navigate(`/possession/${libelle}/update`);
  };

  const { personName } = useParams(); // Extraire le nom de la personne depuis l'URL
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPersonPossessions, setSelectedPersonPossessions] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState([]);

  useEffect(() => {
    const person = people.find(p => p.name === personName);
    if (person) {
        setSelectedPerson(person)
      const patrimoine = patrimoines.find(p => p.person === person.name);
      if (patrimoine) {
        setSelectedPersonPossessions(patrimoine.possessions);
      }
    }
  }, [personName, people, patrimoines]);

  
  return (<>
   <div className=" mt-2 p-3">
      <h2>Possessions de {personName}</h2>
      <Button
      className='mb-3'
            variant="secondary"
            onClick={() => handleShowAddPossession(selectedPerson)}
        >
            Ajouter Possession
        </Button>

      <Row>
        <Col className="d-flex justify-content-center">
          <Card className="w-100">
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
                    <th>Actions</th>
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
                        <td>
                          <DatePicker
                            selected={new Date(endDate)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            disabled
                          />
                        </td>
                      <td>
                        {possession.type === 'Argent' && possession.typeArgent === 'Epargne'
                          ? `${possession.interestRate} %`
                          : possession.type === 'Materiel'
                          ? `${possession.depreciationRate} %`
                          : ''}
                      </td>
                      <td>
                        {calculateCurrentValue(possession, new Date(endDate))}
                      </td>
                      <td>
                      <Button variant="warning" onClick={() => {}}>Éditer</Button>
                      <Button variant="danger" onClick={() => {}}>Clôturer</Button>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-start mt-4 mb-4" style={{width:'50%'}}>
        <Col md={8} className="text-start">
          <Card className="card-custom">
            <Card.Body>
            <Card.Title className="card-text-custom">
                  Calcul Patrimoine
            </Card.Title>
            <DatePicker
                          selected={getPatrimoineDate}
                          onChange={(getPatrimoineDate) => setGetPatrimoineDate(getPatrimoineDate)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                        />

            <Card.Text className="card-text-custom">
             Total =  {sumPatrimoine}
            </Card.Text>

              <Button variant="primary" className="btn-custom" onClick={() => {setSumPatrimoine(calculatePatrimoineValue(selectedPersonPossessions, getPatrimoineDate)); setEndDate(getPatrimoineDate)}}>
                Valider
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    </>
)};

export default ShowPossessionsModal;
