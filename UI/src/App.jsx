import 'react-datepicker/dist/react-datepicker.css';

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Container, Row, Col, Card, Table, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


import AddPossessionModal from './components/modals/AddPossessionModal.jsx';
import ShowPossessionsPage from './pages/ShowPossessionsPage.jsx';
import UpdatePossessionPage from './pages/UpdatePossessionPage.jsx';
import LineChart from './components/charts/LineCharts.jsx';
import NavbarComponent from './components/layout/PatrimoineNavbar.jsx';

const apiUrl = import.meta.env.VITE_API_URL;


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
  const [endDate, setEndDate] = useState(null);
  const [interestRate, setInterestRate] = useState(0);
  const [depreciationRate, setDepreciationRate] = useState(0);
  const [getAmountDate, setGetAmountDate] = useState(0);
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [selectedPersonPossessions, setSelectedPersonPossessions] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    // Fetch people and patrimoines from json-server
    const loadData = async () => {
      const peopleResponse = await fetch(`${apiUrl}/people`);
      const peopleData = await peopleResponse.json();
      setPeople(peopleData);
  
      const patrimoinesResponse = await fetch(`${apiUrl}/patrimoines`);
      const patrimoinesData = await patrimoinesResponse.json();
      setPatrimoines(patrimoinesData);
      
    };
  
    loadData();
  }, [people, patrimoines]); // tableau de dépendances vide pour exécuter l'effet uniquement lors du premier rendu
  


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

      await fetch(`${apiUrl}/possession`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ possession: newPossession }),
      });
  
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
  

  const handleShowAddPossession = (person) => {
    setSelectedPerson(person.name);
    setShowAddPossession(true);
  };
  const handleCloseAddPossession = () => setShowAddPossession(false);


  return (
    <>
    <Router>
    <NavbarComponent/>
      <Routes>
        <Route path="/" element={
          <>
            <LineChart
              people={people}
              patrimoines={patrimoines}
            />
          </>
          }/>
        <Route path="/possessions" element={
            <ShowPossessionsPage 
            handleShowAddPossession={handleShowAddPossession}/>}/>
        <Route path="/possession/update/:libelleValue" element={<UpdatePossessionPage 
                                                                    people={people}
                                                                    patrimoines={patrimoines}
                                                                    setPatrimoines={setPatrimoines}
                                              setPeople={setPeople}/>}  />
      </Routes>
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

      
    </Router>
    </>
  );
}

export default App;
