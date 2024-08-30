# Patrimoine

## TODO: Avant 30/08/2024 08:00 GMT+3
- Backend (NodeJS/Express)

    Create folder ``backend`` in the root

    Endpoints:
    - /possession: Get Possession list
    - /possession: Create Possession: [libelle, valeur, dateDebut, taux]
    - /possession/:libelle: Update Possession by libelle: [libelle, dateFin]
    - /possession/:libelle/close: Close Possession => set dateFin to current Date
    - /patrimoine/:date: Get Valeur Patrimoine: [Date] => Valeur
    - /patrimoine/range: 
      {
        type: 'month',
        dateDebut: xxx,
        dateFin: xxx,
        jour: xx
      }
      Get Valeur Patrimoine Range: [DateDebut, DateFin, Jour, type] => Valeur Patrimoine between dateDebut - dateFin by type=month
- UI (React JS):
    -  Header: 
        - Menu Patrimoine => Page patrimoine
        - Menu Possessions => Page List Possession 
    -  Page Patrimoine (/patrimoine)
        - Chart:
            - DatePicker dateDebut, DatePicker dateFin, Select Jour
            - Button: Validate => onClick -> Get Valeur Patrimoine by Range with Jour
            - Line Chart (Chart.js) 
        - Get valeur patrimoine:
            - DatePicker Date
            - Button: Validâtes => onClick -> Get Valeur Patrimoine on the selected date 
    - Page List Possession: (/possession)
        - Button Create Possession: Redirect to Create Possession page
        - Tableau: List possession
            - Column: Libelle, Valeur, Date Début, Date Fin, Taux, Valeur actuelle + [Action]
            - Action:
                - Edit: Redirect to Edition Possession page
                - Close/Clôture -> API: Close Possession
    - Create Possession: (/possession/create)
        - Inputs: Libelle, Valeur, date début, taux
    - Update Possession: (/possession/:libelle/update)
        - Inputs: Libelle, date fin

data.json:

``` json
    {
  "people": [
    {
      "id": "e63b",
      "name": "ilo"
    }
  ],
  "patrimoines": [
    {
      "id": "e63b",
      "person": "ilo",
      "possessions": [

        {
          "type": "Materiel",
          "libelle": "MacBook Pro",
          "amount": 4000000,
          "constAmount": 4000000,
          "startDate": "2023-12-25T00:00:00.000Z",
          "depreciationRate": 5
        },

        {
          "type": "Argent",
          "typeArgent":"Courant",
          "libelle": "Alternance",
          "amount": 0,
          "constAmount": 500000,
          "startDate": "2022-12-31T21:00:00.000Z",
          "getAmountdate": 1
        },

        {
          "type": "TrainDeVie",
          "libelle": "Survie",
          "amount": 0,
          "constAmount": 300000,
          "startDate": "2022-12-31T21:00:00.000Z",
          "getAmountdate": 2
        }
      ]
    }
  ]
}
```


App.jsx
``` jsx
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home.jsx';
import Header from './components/Header.jsx';
import TablePossessions from './components/TablePossessions.jsx';

function App() {
  const [showPossessions, setShowPossessions] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [people, setPeople] = useState([]);
  const [patrimoines, setPatrimoines] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedPersonPossessions, setSelectedPersonPossessions] = useState([]);
  const [getPatrimoineDate, setGetPatrimoineDate] = useState(new Date());
  const [sumPatrimoine, setSumPatrimoine] = useState(0);
  
  useEffect(() => {
    // Fetch people and patrimoines from Express server
    const loadData = async () => {
      
      const peopleResponse = await fetch('http://localhost:5000/people');
      const peopleData = await peopleResponse.json();
      
      setPeople(peopleData);

      const patrimoinesResponse = await fetch('http://localhost:5000/patrimoines');
      const patrimoinesData = await patrimoinesResponse.json();
      setPatrimoines(patrimoinesData);

      if (peopleData.length > 0) {
        handleShowPossessions(peopleData[0]);
      }
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
    <Home />
    <Container className="mt-5" style={{ width: '100vw' }}>
      <TablePossessions
        selectedPersonPossessions={selectedPersonPossessions}
        getPatrimoineDate={getPatrimoineDate}
        setGetPatrimoineDate={setGetPatrimoineDate}
        sumPatrimoine={sumPatrimoine}
        setSumPatrimoine={setSumPatrimoine}
        endDate={endDate}
        setEndDate={setEndDate}
      />
    </Container>
    
    </>
  );
}

export default App;

```



server.js
``` js

// server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Path to the data file
const dataPath = path.join(__dirname, '../data/data.json');

// Read data from JSON file
const readData = () => {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

// Write data to JSON file
const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
};


app.get('/people', (req, res) => {
  const { people } = readData();
  res.json(people);
});

app.get('/patrimoines', (req, res) => {
  const { patrimoines } = readData();
  
  res.json(patrimoines);
});

// Get Possession list
app.get('/possession/:pers', (req, res) => {
    const { pers } = req.params
    const { patrimoines } = readData();
    const possessions = patrimoines.find(p => p.person === pers);
    res.json(possessions);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

```