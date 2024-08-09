import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home.jsx';
import TablePossessions from './components/TablePossessions.jsx';

function App() {
  const [showPossessions, setShowPossessions] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [people, setPeople] = useState([]);
  const [patrimoines, setPatrimoines] = useState([]);
  const [selectedPersonPossessions, setSelectedPersonPossessions] = useState([]);
  const [getPatrimoineDate, setGetPatrimoineDate] = useState(new Date());
  const [sumPatrimoine, setSumPatrimoine] = useState(0);
  
  useEffect(() => {
    // Fetch people and patrimoines from json-server
    const loadData = async () => {
      
      const peopleResponse = await fetch('http://localhost:5000/people');
      const peopleData = await peopleResponse.json();
      setPeople(peopleData);

      const patrimoinesResponse = await fetch('http://localhost:5000/patrimoines');
      const patrimoinesData = await patrimoinesResponse.json();
      setPatrimoines(patrimoinesData);

      handleShowPossessions(people[0])
      

    };

    loadData();
  }, [people, patrimoines]);



  const handleShowPossessions = (person) => {
    const personPatrimoine = patrimoines.find(p => p.person === person.name);
    setSelectedPersonPossessions(personPatrimoine ? personPatrimoine.possessions : []);
    setSelectedPerson(person.name);
  };




  return (
    <>
    <Home person={people[0]} />
    <Container className="mt-5" style={{ width: '100vw' }}>
      <TablePossessions
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
