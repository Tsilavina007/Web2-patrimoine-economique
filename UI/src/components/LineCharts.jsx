import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const LineChart = ({patrimoineId}) => {
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [chartData, setChartData] = useState({});
  
  
  const fetchPatrimoineData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/patrimoine/range?id=${patrimoineId}&dateDebut=${dateDebut.toISOString()}&dateFin=${dateFin.toISOString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patrimoine data');
      }
      const data = await response.json();
      
      console.log(data);
      
      // Préparer les données pour le graphique
      const labels = data.map(item => `${item.month}-${item.year}`);
      const values = data.map(item => item.valeur);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Valeur du Patrimoine par Mois',
            data: values,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching patrimoine data:', error);
    }
  };



  return (
    <div className="mt-5 d-flex w-100">
      <div className='me-5 p-3' style={{backgroundColor:"#dee8e6", borderRadius:"10px"}}>
      <h2>Valeur du Patrimoine par Mois</h2>
      <Form>
        <Form.Group controlId="formDateDebut" className="mt-3">
          <Form.Label>Date de Début</Form.Label>
          <div>
          <DatePicker
            selected={dateDebut}
            onChange={(date) => setDateDebut(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
          </div>
        </Form.Group>
        <Form.Group controlId="formDateFin" className="mt-3">
          <Form.Label>Date de Fin</Form.Label>
          <div>
          <DatePicker
            selected={dateFin}
            onChange={(date) => setDateFin(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
          </div>
        </Form.Group>
        <Button variant="primary" onClick={() => fetchPatrimoineData()} className="mt-3">
          Valider
        </Button>
      </Form>
      </div>

      {chartData.labels && chartData.labels.length > 0 && (
        <div style={{backgroundColor:"#dee8e6", borderRadius:"10px", width:"75%", height:"auto"}}>
          <Line className='w-100' data={chartData} />
        </div>
      )}
      
    </div>
  );
};

export default LineChart;