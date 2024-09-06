import React, { useState, useEffect } from 'react';
import calculatePatrimoineValue from '../../models/calculatePatrimoineValue';
import { Row, Col, Card, Table, Button, Form } from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import usefetchPatrimoineData from '../../hooks/useFetchPatrimoineData';

const apiUrl = import.meta.env.VITE_API_URL;

const LineChart = ({ people, patrimoines}) => {
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateDebutToChange, setDateDebutToChange] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [dateFinToChange, setDateFinToChange] = useState(new Date());
  const [day, setDay] = useState(1);
  const [dayToChange, setDayToChange] = useState(1);
  const [chartData, setChartData] = useState({});
    
  const [getPatrimoineDate, setGetPatrimoineDate] = useState(new Date());
  const [sumPatrimoine, setSumPatrimoine] = useState(0);
  const [selectedPersonPossessions, setSelectedPersonPossessions] = useState([]); // Extraire le nom de la personne depuis l'URL
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedPatrimoinesId, setSelectedPatrimoinesId] = useState('');


  useEffect(() => {
    const person = people;
    if (person) {
        setSelectedPerson(person)
      const patrimoine = patrimoines;
      if (patrimoine) {
        setSelectedPatrimoinesId(patrimoine.id)
        setSelectedPersonPossessions(patrimoine.possessions);
      }
    }
  }, [patrimoines]);

  useEffect(() => {
    fetchPatrimoineData();
  }, [day, dateDebut, dateFin]);

  const handleChangeDate =  () => {
    setDateDebut(dateDebutToChange);
    setDateFin(dateFinToChange);
    setDay(dayToChange);
  }

  const fetchPatrimoineData = async () => {

    const response = await fetch(`${apiUrl}/patrimoine/range?dateDebut=${dateDebut.toISOString()}&dateFin=${dateFin.toISOString()}&day=${day}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patrimoine data');
      }
    
    const data = await response.json();
    const labels = data.map(item => `${item.getDay}/${item.month}/${item.year}`);
    const values = data.map(item => item.valeur);
    setChartData({
      labels,
      datasets: [
        {
          label: 'Valeur du Patrimoine par Mois',
          data: values,
          fill: true,
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
        },
      ],
    });

  };



  return (
<div className="container-fluid p-4" style={{ marginTop: "5rem", backgroundColor: "#eef2f7" }}>
  <div className="d-flex flex-wrap gap-4">

    {/* Section Formulaire Patrimoine */}
    <div className="p-4 flex-grow-1" style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ marginBottom: "1rem", fontSize: "1.75rem", color: "#2c3e50" }}>LineChart patrimoine par Mois</h2>
      
      <Form className="d-flex gap-3">
        {/* Date de Début */}
        <Form.Group controlId="formDateDebut" className="mb-4" style={{ flex: 1 }}>
          <Form.Label className="me-3" style={{ fontSize: "1.1rem", color: "#34495e" }}>Date de Début</Form.Label>
          <DatePicker
            selected={dateDebutToChange}
            onChange={(date) => setDateDebutToChange(date)}
            dateFormat="dd-MM-yyyy"
            className="form-control"
            style={{ borderRadius: "8px", borderColor: "#bbb", backgroundColor: "#fff", color: "#2c3e50" }}
          />
        </Form.Group>

        {/* Date de Fin */}
        <Form.Group controlId="formDateFin" className="mb-4" style={{ flex: 1 }}>
          <Form.Label className="me-3" style={{ fontSize: "1.1rem", color: "#34495e" }}>Date de Fin</Form.Label>
          <DatePicker
            selected={dateFinToChange}
            onChange={(date) => setDateFinToChange(date)}
            dateFormat="dd-MM-yyyy"
            className="form-control"
            style={{ borderRadius: "8px", borderColor: "#bbb", backgroundColor: "#fff", color: "#2c3e50" }}
          />
        </Form.Group>

        {/* Jour */}
        <Form.Group controlId="formJour" className="mb-4 d-flex align-items-center">
          <Form.Label className="me-3" style={{ fontSize: "1.1rem", color: "#34495e", marginRight: "10px" }}>Jour</Form.Label>
          <Form.Control
            type="number"
            placeholder="Jour"
            value={dayToChange}
            onChange={(e) => setDayToChange(parseFloat(e.target.value))}
            style={{ borderRadius: "8px", borderColor: "#bbb", backgroundColor: "#fff", color: "#2c3e50", width: "70px" }}
          />
        </Form.Group>
      </Form>

      {/* Bouton Valider */}
      <Button variant="primary" onClick={() => handleChangeDate()} style={{ borderRadius: "8px", backgroundColor: "#3498db", borderColor: "#2980b9", color: "#fff", padding: "10px 20px" }}>
        Valider
      </Button>
    </div>

    {/* Section Valeur Patrimoine */}
    <Card style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", flexBasis: "300px" }}>
      <div className="text-center p-3" >
        <h2 style={{ color: "#2c3e50" }}>Valeur Patrimoine</h2>
      </div>
      <Card.Body className="text-center d-flex flex-column align-items-center pt-0">
        <DatePicker
          selected={getPatrimoineDate}
          onChange={(g) => setGetPatrimoineDate(g)}
          dateFormat="dd/MM/yyyy"
          className="form-control mb-3"
          style={{ borderRadius: "8px", borderColor: "#ddd", backgroundColor: "#fff" }}
        />
        <Button variant="primary" onClick={() => { setSumPatrimoine(calculatePatrimoineValue(selectedPersonPossessions, getPatrimoineDate)) }} style={{ borderRadius: "8px", backgroundColor: "#3498db", borderColor: "#2980b9", color: "#fff" }}>
          Valider
        </Button>
        <Card.Text className="mt-4" style={{ fontSize: "2rem", color: "#333" }}>
          {sumPatrimoine}
        </Card.Text>
      </Card.Body>
    </Card>

  </div>

  {/* Section Graphique */}
  {chartData.labels && (
    <div className="p-4 mt-4" style={{ backgroundColor: "#f9f9f9", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: "100%" }}>
      <Line className="w-100" data={chartData} />
    </div>
  )}
</div>

  );
};

export default LineChart;