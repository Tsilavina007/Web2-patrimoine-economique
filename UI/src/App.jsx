import 'react-datepicker/dist/react-datepicker.css';

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Container, Row, Col, Card, Table, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


import Home from './components/Home.jsx';
import ConfirmationModal from './components/ConfiramtionModal.jsx';
import AddPersonModal from './components/AddPersonModal.jsx';
import AddPossessionModal from './components/AddPossessionModal.jsx';
import ShowPossessionsModal from './components/ShowPossessionsModal.jsx';
import ShowPossessionsPage from './components/ShowPossessionsPage.jsx';
import PatrimoinesTable from './components/PatrimoinesTable.jsx';
import UpdatePossessionPage from './components/UpdatePossessionPage.jsx';
import LineChart from './components/LineCharts.jsx';


function App() {
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddPossession, setShowAddPossession] = useState(false);
  const [showPossessions, setShowPossessions] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPersonToDelete, setSelectedPersonToDelete] = useState({});
  const [people, setPeople] = useState([]);
  const [patrimoines, setPatrimoines] = useState([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [type, setType] = useState('Argent');
  const [typeArgent, setTypeArgent] = useState('Especes');
  const [libelle, setLibelle] = useState('');
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [interestRate, setInterestRate] = useState(0);
  const [depreciationRate, setDepreciationRate] = useState(0);
  const [getAmountDate, setGetAmountDate] = useState(0);
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [selectedPersonPossessions, setSelectedPersonPossessions] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  

  useEffect(() => {
    // Fetch people and patrimoines from json-server
    const loadData = async () => {
      const peopleResponse = await fetch('http://localhost:5000/people');
      const peopleData = await peopleResponse.json();
      setPeople(peopleData);
  
      const patrimoinesResponse = await fetch('http://localhost:5000/patrimoines');
      const patrimoinesData = await patrimoinesResponse.json();
      setPatrimoines(patrimoinesData);
    };
  
    loadData();
  }, [people, patrimoines]); // tableau de dépendances vide pour exécuter l'effet uniquement lors du premier rendu
  




  const handleAddPerson = async () => {
    const newPerson = { name: newPersonName };
    const response = await fetch('http://localhost:5000/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPerson),
    });
    const personData = await response.json();
    setPeople([...people, personData]);

    // Add new patrimoine for the person
    const newPatrimoine = { person: newPersonName, possessions: [] };
    await fetch('http://localhost:5000/patrimoines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPatrimoine),
    });

    setShowAddPerson(false);
    setNewPersonName('');
  };

  const handleAddPossession = async () => {
    let newPossession = { type, typeArgent, libelle, amount, startDate, endDate, interestRate, depreciationRate, getAmountDate };
  
    switch (type) {
      case "Argent":
        if (typeArgent === "Epargne") {
          newPossession = { type, typeArgent, libelle, amount, startDate, endDate, interestRate };
        } else {
          newPossession = { type, typeArgent, libelle, amount, startDate, endDate, getAmountDate };
        }
        break;
      case "Materiel":
        newPossession = { type, libelle, amount, startDate, endDate, depreciationRate };
        break;
      case "TrainDeVie":
        newPossession = { type, libelle, amount, startDate, endDate, getAmountDate };
        break;
      default:
        newPossession = { type, libelle, amount, startDate, endDate, interestRate, depreciationRate };
        break;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/possessions/${selectedPerson}`);
      const personPatrimoine = await response.json();
      if (!personPatrimoine || !personPatrimoine.possessions) {
        throw new Error('Invalid data structure');
      }
  
      const updatedPossessions = [...personPatrimoine.possessions, newPossession];
  
      await fetch(`http://localhost:5000/patrimoine/${personPatrimoine.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ possessions: updatedPossessions }),
      });
  
      setPatrimoines(patrimoines.map(patrimoine => patrimoine.person === selectedPerson
        ? { ...patrimoine, possessions: updatedPossessions }
        : patrimoine
      ));
  
      setShowAddPossession(false);
      setLibelle('');
      setAmount(0);
      setStartDate(new Date());
      setEndDate(new Date());
      setInterestRate(0);
      setDepreciationRate(0);
      setGetAmountDate(0);
  
    } catch (error) {
      console.error('Error adding possession:', error);
    }
  };
  

  
  

 const handleDeletePerson = async (person) => {
    // Trouver le patrimoine associé à la personne
    const patrimoineResponse = await fetch(`http://localhost:5000/patrimoines?person=${person.name}`);
    const [personPatrimoine] = await patrimoineResponse.json();
    
    // Supprimer les possessions
    if (personPatrimoine) {
      await fetch(`http://localhost:5000/patrimoines/${personPatrimoine.id}`, { method: 'DELETE' });
    }

    // Supprimer la personne
    await fetch(`http://localhost:5000/people/${person.id}`, { method: 'DELETE' });

    // Mettre à jour l'état
    setPeople(people.filter(p => p.id !== person.id));
    setPatrimoines(patrimoines.filter(p => p.person !== person.name));
    setShowConfirmDelete(false);
  };

  const handleShowAddPerson = () => setShowAddPerson(true);
  const handleCloseAddPerson = () => setShowAddPerson(false);
  const handleShowAddPossession = (person) => {
    setSelectedPerson(person.name);
    setShowAddPossession(true);
  };
  const handleCloseAddPossession = () => setShowAddPossession(false);

  const handleShowPossessions = (person) => {
    const personPatrimoine = patrimoines.find(p => p.person === person.name);
    setSelectedPersonPossessions(personPatrimoine ? personPatrimoine.possessions : []);
    setSelectedPerson(person.name);
    setShowPossessions(true);
  };

  const handleClosePossessions = () => setShowPossessions(false);

  
  const handleCloseConfirmDelete = () => setShowConfirmDelete(false);
  const handleShowConfirmDelete = (person) => {
    setSelectedPersonToDelete(person);
    setShowConfirmDelete(true);
  };



  return (
    <>
    <Router>
    <Navbar bg="dark" variant="dark" expand="lg" className='p-3 position-fixed w-100 z-1'>
        <Navbar.Brand as={Link} to="/">Patrimoines</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/possessions">Possessions</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/" element={
            <Home handleShowAddPerson={handleShowAddPerson} />
          }/>
        <Route path="/possessions" element={
            <PatrimoinesTable
              people={people}
              patrimoines={patrimoines}
              handleShowAddPossession={handleShowAddPossession}
              handleShowPossessions={handleShowPossessions}
              handleShowConfirmDelete={handleShowConfirmDelete}
            />
            
          }/>
        <Route path="/possessions/:personName" element={<><ShowPossessionsPage 
                                                        handleShowAddPossession={handleShowAddPossession} 
                                                        people={people}
                                                        patrimoines={patrimoines}
                                                        setPatrimoines={setPatrimoines}/>
                                                        
                                                        </>} />
        <Route path="/possession/:personName/update/:libelleValue" element={<UpdatePossessionPage 
                                                                    people={people}
                                                                    patrimoines={patrimoines}
                                                                    setPatrimoines={setPatrimoines}
                                                                    setPeople={setPeople}/>}  />
      </Routes>

      {showAddPerson && (
        <AddPersonModal
          show={showAddPerson}
          handleClose={handleCloseAddPerson}
          newPersonName={newPersonName}
          setNewPersonName={setNewPersonName}
          handleAddPerson={handleAddPerson}
        />
      )}
      {showAddPossession && (
        <AddPossessionModal
          show={showAddPossession}
          handleClose={handleCloseAddPossession}
          type={type}
          setType={setType}
          typeArgent={typeArgent}
          setTypeArgent={setTypeArgent}
          libelle={libelle}
          setLibelle={setLibelle}
          amount={amount}
          setAmount={setAmount}
          startDate={startDate}
          setStartDate={setStartDate}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          depreciationRate={depreciationRate}
          setDepreciationRate={setDepreciationRate}
          getAmountDate={getAmountDate}
          setGetAmountDate={setGetAmountDate}
          handleAddPossession={handleAddPossession}
        />
      )}
      {showConfirmDelete && (
        <ConfirmationModal
          show={showConfirmDelete}
          handleClose={handleCloseConfirmDelete}
          selectedPerson={selectedPersonToDelete}
          handleDelete={handleDeletePerson}
        />
      )}
      
    </Router>
    </>
  );
}

export default App;
