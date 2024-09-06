import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import calculatePatrimoineValue from '../models/calculatePatrimoineValue.js';
import calculatePatrimoineValue from '../UI/src/models/calculatePatrimoineValue.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());


const dataFilePath = path.join(__dirname, '../data/data2.json');
let data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
let peopleData = data[0].data;
let patrimoinesData = data[1].data;


app.get('/people', (req, res) => {
  res.json(peopleData);
});


app.get('/patrimoines', (req, res) => {
  res.json(patrimoinesData);
});


app.get('/possession', (req, res) => {
  res.json(patrimoinesData.possessions);
});


app.post('/possession', (req, res) => {
  const newPossession = req.body;
  newPossession.possession["owner"] = patrimoinesData.owner
  data[1].data.possessions.push(newPossession.possession);
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.json(newPossession.possession);
});


app.get('/possession/:libelle', (req, res) => {
    const libelle = req.params.libelle;
    const possession = patrimoinesData.possessions.find(poss => poss.libelle === libelle);
    if (!possession) {
      return res.status(404).json({ error: 'Possession not found ' + libelle  });
    }
    res.json(possession);
});



app.patch('/possession/:libelle', (req, res) => {
    const libelle = req.params.libelle;
    // const {updateLibelle, updateDateFin} = req.body;
    const updatedData = req.body;
    let updatePossession = patrimoinesData.possessions.find(poss => poss.libelle === libelle);
    if (!updatePossession) {
      return res.status(404).json({ error: 'Possession not found ' + libelle  });
    } else {
      data[1].data.possessions.map(poss => {
        if (poss.libelle === libelle) {
          poss.libelle = updatedData.updateLibelle;
          poss.endDate = updatedData.updateDateFin;
        }
      });
      updatePossession.libelle = updatedData.updateLibelle;
      updatePossession.endDate = updatedData.updateDateFin;
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.json(updatePossession);
});


app.patch('/possession/:libelle/close', (req, res) => {
    const libelle = req.params.libelle;
    let updatePossession = patrimoinesData.possessions.find(poss => poss.libelle === libelle);
    if (!updatePossession) {
      return res.status(404).json({ error: 'Possession not found ' + libelle  });
    } else {
      data[1].data.possessions.map(poss => {poss.libelle === libelle?poss.endDate = new Date():poss});
      updatePossession.endDate = new Date();
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.json(updatePossession);
});


app.get('/patrimoines/:date', (req, res) => {
  const date = new Date(req.params.date);
  let value = calculatePatrimoineValue(patrimoinesData.possessions, date);
  res.json(value);
  // res.json(date)  
});


// Endpoint pour obtenir la valeur du patrimoine par mois sur une période donnée
app.get('/patrimoine/range', (req, res) => {
  const { dateDebut, dateFin, day } = req.query;
  
  // Convertir les dates en objets Date
  const startDate = new Date(dateDebut);
  const endDate = new Date(dateFin);

  if (startDate.getDate() > day) {
    startDate.setMonth(startDate.getMonth() + 1);
  }

  startDate.setDate(day);

  const patrimoine = patrimoinesData; 
  
  // Préparer un objet pour stocker la valeur du patrimoine par mois
  const monthlyValues = {};

 // Convertir la date de début en objet Date

    let possessionStartDate = new Date(startDate);
    let possessionEndDate =new Date(endDate);
    // if (possessionEndDate.getFullYear() > startDate.getFullYear()) {
    //   possessionEndDate.setMonth(possessionEndDate.getMonth() +1)
    // }

    // Boucler à travers chaque mois entre la date de début et la date de fin
    let currentDate = new Date(startDate);

    while (currentDate <= possessionEndDate) { 
      let monthKey = `${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`;
      // monthKey = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

      
      if (!monthlyValues[monthKey]) {
        monthlyValues[monthKey] = 0;
      }
      // Calculer la valeur de la patrimoine à cette date
      let value = calculatePatrimoineValue(patrimoine.possessions, currentDate);

      monthlyValues[monthKey] += value;

      // Passer au mois suivant
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

  // Formater les données pour le retour
  const result = Object.keys(monthlyValues).map(key => {
    const [getDay, month, year] = key.split('-');
    return {
      getDay,
      month,
      year,
      valeur: Math.round(monthlyValues[key]) // Arrondir les valeurs
    };
  });

  res.json(result);
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
