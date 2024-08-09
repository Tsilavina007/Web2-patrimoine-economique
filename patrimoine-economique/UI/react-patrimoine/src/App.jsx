import 'react-datepicker/dist/react-datepicker.css';
import { readFile, writeFile } from "./../../../data/index.js";
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home.jsx';
import ShowPossessionsModal from './components/ShowPossessionsModal.jsx';


function App() {
  const [showPossessions, setShowPossessions] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [people, setPeople] = useState([]);
  const [patrimoines, setPatrimoines] = useState([]);
  const [selectedPersonPossessions, setSelectedPersonPossessions] = useState([]);
  const [getPatrimoineDate, setGetPatrimoineDate] = useState(new Date());
  const [sumPatrimoine, setSumPatrimoine] = useState(0);
  
  const pathDataJson = "./../../../data/dataBase.json"

  useEffect(() => {
    // Fetch people and patrimoines from json-server
    const loadData = async () => {
      
      // const peopleResponse = await fetch('http://localhost:5000/people');
      // const peopleData = await peopleResponse.json();
      const peopleData = readFile(pathDataJson);
      console.log(peopleData);
      setPeople(peopleData);

      // const patrimoinesResponse = await fetch('http://localhost:5000/patrimoines');
      // const patrimoinesData = await patrimoinesResponse.json();
      const patrimoinesData = readFile(pathDataJson);
      setPatrimoines(patrimoinesData);
    };

    loadData();
  }, [people, patrimoines]);



  const handleShowPossessions = (person) => {
    const personPatrimoine = patrimoines.find(p => p.person === person.name);
    setSelectedPersonPossessions(personPatrimoine ? personPatrimoine.possessions : []);
    setSelectedPerson(person.name);
    setShowPossessions(true);
  };

  const handleClosePossessions = () => setShowPossessions(false);

  



  return (
    <>
    <Home handleShowPossessions={handleShowPossessions} person={people[0]} />
    <Container className="mt-5" style={{ width: '100vw' }}>
      <ShowPossessionsModal
        show={showPossessions}
        handleClose={handleClosePossessions}
        selectedPerson={selectedPerson}
        selectedPersonPossessions={selectedPersonPossessions}
        getPatrimoineDate={getPatrimoineDate}
        setGetPatrimoineDate={setGetPatrimoineDate}
        sumPatrimoine={sumPatrimoine}
        setSumPatrimoine={setSumPatrimoine}
      />
    </Container>
    </>
  );
}

export default App;
