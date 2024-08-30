import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import calculatePatrimoineValue from '../models/calculatePatrimoineValue.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, '../data/data.json');
let data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

app.get('/people', (req, res) => {
  res.json(data.people);
});

app.post('/people', (req, res) => {
  const newPerson = req.body;
  newPerson.id = Date.now().toString();
  data.people.push(newPerson);
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.json(newPerson);
});

app.delete('/people/:id', (req, res) => {
  data.people = data.people.filter(p => p.id !== req.params.id);
  data.patrimoines = data.patrimoines.filter(p => p.person !== req.params.id);
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.sendStatus(204);
});

app.get('/patrimoines', (req, res) => {
  res.json(data.patrimoines);
});


app.post('/patrimoines', (req, res) => {
  const newPatrimoine = req.body;
  newPatrimoine.id = Date.now().toString();
  data.patrimoines.push(newPatrimoine);
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.json(newPatrimoine);
});

// Endpoint pour obtenir les possessions d'une personne spécifique
app.get('/possessions/:person', (req, res) => {
    const personName = req.params.person;
    // Trouver le patrimoine de la personne spécifiée
    const patrimoine = data.patrimoines.find(patrimoine => patrimoine.person === personName);
    if (!patrimoine) {
      return res.status(404).json({ error: 'Person not found ' + personName  });
    }
    // Retourner les possessions de la personne
    res.json(patrimoine);
  });



  app.patch('/patrimoine/:id', (req, res) => {
    const patrimoineId = req.params.id;
    const updatedData = req.body;
  
    // Trouver le patrimoine à mettre à jour
    const patrimoineIndex = data.patrimoines.findIndex(patrimoine => patrimoine.id === patrimoineId);
  
    if (patrimoineIndex === -1) {
      return res.status(404).json({ error: 'Patrimoine not found' });
    }
  
    // Mettre à jour les possessions
    data.patrimoines[patrimoineIndex].possessions = updatedData.possessions;
  
    // Sauvegarder les données mises à jour dans le fichier
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  
    // Répondre avec les données mises à jour
    res.json(data.patrimoines[patrimoineIndex]);
  });



app.delete('/patrimoines/:id', (req, res) => {
  data.patrimoines = data.patrimoines.filter(p => p.id !== req.params.id);
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.sendStatus(204);
});


// Endpoint pour obtenir la valeur du patrimoine par mois sur une période donnée
app.get('/patrimoine/range', (req, res) => {
  const { id, dateDebut, dateFin } = req.query;
  
  // Convertir les dates en objets Date
  const startDate = new Date(dateDebut);
  const endDate = new Date(dateFin);

  const patrimoineIndex = data.patrimoines.findIndex(patrimoine => patrimoine.id === id);
  if (patrimoineIndex === -1) {
    return res.status(404).json({ error: 'Patrimoine not found' });
  }

  // Récupérer les possessions
  const patrimoine = data.patrimoines[patrimoineIndex]; // On suppose qu'il y a un seul patrimoine pour simplifier
  
  // Préparer un objet pour stocker la valeur du patrimoine par mois
  const monthlyValues = {};

 // Convertir la date de début en objet Date

    let possessionStartDate = new Date(startDate);
    let possessionEndDate =new Date(endDate);
    if (possessionEndDate.getFullYear() > startDate.getFullYear()) {
      possessionEndDate.setMonth(possessionEndDate.getMonth() +1)
    }
    // Si la possession commence après la date de fin ou se termine avant la date de début, l'ignorer
    // if (possessionStartDate > endDate || possessionEndDate < startDate) return;

    // Boucler à travers chaque mois entre la date de début et la date de fin
    let currentDate = new Date(startDate);



    while (currentDate < possessionEndDate) { 
      let monthKey = ``;
      // monthKey = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

      if (currentDate.getMonth() >= 2 && startDate.getFullYear() < currentDate.getFullYear() ) {
        monthKey = `${currentDate.getMonth() }-${currentDate.getFullYear()}`;
      } else {
        monthKey = `${currentDate.getMonth()+1}-${currentDate.getFullYear()}`;
      }

      if (!monthlyValues[monthKey]) {
        monthlyValues[monthKey] = 0;
      }

      
      // Calculer la valeur de la possession à cette date
      let value = calculatePatrimoineValue(patrimoine.possessions, currentDate);



      monthlyValues[monthKey] += value;

      // Passer au mois suivant
      currentDate.setMonth(currentDate.getMonth() + 1);
    }




  // Formater les données pour le retour
  const result = Object.keys(monthlyValues).map(key => {
    const [month, year] = key.split('-');
    return {
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
