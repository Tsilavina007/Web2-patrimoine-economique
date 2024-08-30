import React from 'react';
import {Button, Table, Card, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import { useParams,  useNavigate } from 'react-router-dom';
import calculateCurrentValue from '../../../models/calculateCurrentValue.js';
import calculatePatrimoineValue from '../../../models/calculatePatrimoineValue.js';
import LineChart from './LineCharts.jsx';

import ConfirmationModal from './ConfirmationSupPosModal.jsx';

const getDateFin = (dateDebut, amortissement) => {
  const yearsToZero = 100 / amortissement;
  const newDateDebut = new Date(dateDebut);
  return new Date(newDateDebut.setFullYear(newDateDebut.getFullYear() + yearsToZero));
};





const ShowPossessionsPage = ({ people, patrimoines, setPatrimoines, handleShowAddPossession}) => {

  const [sumPatrimoine, setSumPatrimoine] = useState(0);
  const [getPatrimoineDate, setGetPatrimoineDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { personName } = useParams(); // Extraire le nom de la personne depuis l'URL
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPersonPossessions, setSelectedPersonPossessions] = useState([]);
  const [selectedPatrimoinesId, setSelectedPatrimoinesId] = useState('');
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedDeletePossession, setSelectedDeletePossession] = useState('');

  const handleCloseConfirmDelete = () => setShowConfirmDelete(false);
  const handleShowConfirmDelete = (selectedPersonPossessions,selectedPatrimoinesId, possession) => {
    setSelectedDeletePossession(possession);
    setShowConfirmDelete(true);
  };
  
  const navigate = useNavigate();

  const handleEdit = (personName, libelle) => {
    navigate(`/possession/${personName}/update/${libelle}`);
  };

  const handleCloturer = async (selectPersonPossessions, id, possession, endDateCloturer) => {
    let updatedPossessions = [];
    
    selectPersonPossessions.forEach(p => {
      if (p === possession) {
        let up = p;
        up.endDate = endDateCloturer;
        updatedPossessions.push(up);
      } else {
        updatedPossessions.push(p);
      }
    });

    await fetch(`http://localhost:5000/patrimoine/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ possessions: updatedPossessions }),
    });

    setPatrimoines(patrimoines.map(patrimoine => patrimoine.person === selectedPerson
      ? { ...patrimoine, possessions: updatedPossessions }
      : patrimoine
    ));
  };

  const handleSupprimer = async ( selectPersonPossessions, id, possession) => {
    let updatedPossessions = [];
    selectPersonPossessions.forEach(p => {
      if (p.libelle != possession.libelle) {
        updatedPossessions.push(p);
      }
    });

    await fetch(`http://localhost:5000/patrimoine/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ possessions: updatedPossessions }),
    });

    setPatrimoines(patrimoines.map(patrimoine => patrimoine.person === selectedPerson
      ? { ...patrimoine, possessions: updatedPossessions }
      : patrimoine
    ));

    setShowConfirmDelete(false);
  };


  useEffect(() => {
    const person = people.find(p => p.name === personName);
    if (person) {
        setSelectedPerson(person)
      const patrimoine = patrimoines.find(p => p.person === person.name);
      if (patrimoine) {
        setSelectedPatrimoinesId(patrimoine.id)
        setSelectedPersonPossessions(patrimoine.possessions);
      }
    }
  }, [personName, patrimoines]);

  
  return (<>
     <div className=" mt-5 p-3">
      <div className='d-flex justify-content-between align-items-end'>
      <div>
      <h1 className='mb-2'>Possessions de {personName}</h1>
      <Button
      className='mb-3'
            variant="secondary"
            onClick={() => handleShowAddPossession(selectedPerson)}
        >
            Ajouter Possession
        </Button>
      </div>

      <div >

      <Row className=" mt-4 mb-4" style={{width:'100%'}}>
        <Col  className="text-start">
          <Card className="card-custom">
            <Card.Body className='d-flex justify-content-between align-items-center '>
            <div className='p-3'>
              <Card.Text className="card-text-custom" style={{fontSize:"2rem"}}>
              {sumPatrimoine}
              </Card.Text>
            </div>
            
            <DatePicker
                          selected={getPatrimoineDate}
                          onChange={(g) => setGetPatrimoineDate(g)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                        />
            

            <div className='p-3'>
              <Button variant="primary" className="btn-custom" onClick={() => {setSumPatrimoine(calculatePatrimoineValue(selectedPersonPossessions, getPatrimoineDate)); setEndDate(getPatrimoineDate)}}>
                Valider
              </Button>
            </div>
            
            </Card.Body>
            
          </Card>
        </Col>
      </Row>
      </div>
      </div>


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
                      <td>{possession.amount}</td>
                      <td>
                        <DatePicker
                          selected={new Date(possession.startDate)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          disabled
                        />
                      </td>
                        <td>
                          {possession.startDate != possession.endDate ? (
                          <DatePicker
                            selected={new Date(possession.endDate)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            disabled  
                          />
                          ) : ""}

                        </td>
                      <td>
                        {possession.type === 'Argent' && possession.typeArgent === 'Epargne'
                          ? `${possession.interestRate} %`
                          : possession.type === 'Materiel'
                          ? `${possession.depreciationRate} %`
                          : ''}
                      </td>
                      <td>{calculateCurrentValue(possession, new Date(endDate))}
                      </td>
                      <td>
                      <Button variant="primary" onClick={() => {handleEdit(selectedPerson.name, possession.libelle)}}>Éditer</Button>
                      <Button variant="warning" onClick={() => {handleCloturer(selectedPersonPossessions,selectedPatrimoinesId, possession, new Date())}}>Clôturer</Button>
                      <Button variant="danger" onClick={() => {handleShowConfirmDelete( selectedPersonPossessions,selectedPatrimoinesId, possession)}}>Supprimer</Button>
                      {showConfirmDelete && (
                        <ConfirmationModal
                          show={showConfirmDelete}
                          handleClose={handleCloseConfirmDelete}
                          name={selectedPerson.name}
                          selectedPersonPossessions={selectedPersonPossessions}
                          possession={selectedDeletePossession}
                          selectedPatrimoinesId={selectedPatrimoinesId}
                          handleDelete={handleSupprimer}
                        />
                      )}
                    </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <LineChart patrimoineId={selectedPatrimoinesId}/>
      </div>
    </>
)};

export default ShowPossessionsPage;
