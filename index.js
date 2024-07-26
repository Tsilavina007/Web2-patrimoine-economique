// Importation des modules nécessaires
import Argent from "./models/Argent.js";
import Materiel from "./models/Materiels.js";
import TrainDeVie from "./models/TrainDeVie.js";
import Person from './models/Person.js';
import Patrimoine from "./models/Patrimoine.js";

// Création de la personne Ilo
let ilo = new Person('Ilo');

// Création des actifs financiers pour Ilo
let espece = new Argent(ilo, "Espèces", 400000);
let compteEpargne = new Argent(ilo, "Compte bancaire épargne", 2000000, 10);
let compteCourant = new Argent(ilo, "Compte bancaire courant", 600000);

// Création des biens matériels pour Ilo
let ordinateur = new Materiel(ilo, "Ordinateur", 2000000, 10);
let vetements = new Materiel(ilo, "Vêtements", 1000000, 20);

// Création des dépenses courantes pour Ilo
let loyer = new TrainDeVie(ilo, "Loyer", 300000);
let nourriture = new TrainDeVie(ilo, "Nourriture", 130000);
let transport = new TrainDeVie(ilo, "Frais de transport", 70000);
let vacances = new TrainDeVie(ilo, "Vacances", 200000);

// Création du patrimoine de Ilo à la date du 13 mai 2024
let patrimoineIlo = new Patrimoine(ilo, '2024-05-13', []);

// Ajout des actifs financiers au patrimoine
patrimoineIlo.addPossession(espece);
patrimoineIlo.addPossession(compteEpargne);
patrimoineIlo.addPossession(compteCourant);

// Ajout des biens matériels au patrimoine
patrimoineIlo.addPossession(ordinateur);
patrimoineIlo.addPossession(vetements);

// Ajout des dépenses courantes au patrimoine
patrimoineIlo.addPossession(loyer);
patrimoineIlo.addPossession(nourriture);
patrimoineIlo.addPossession(transport);
patrimoineIlo.addPossession(vacances);

// Affichage du patrimoine au 13 mai 2024
patrimoineIlo.showPatrimoine();

// Mise à jour de la date du patrimoine au 26 juin 2024
patrimoineIlo.setPatrimoineWithDate('2024-06-26');
patrimoineIlo.showPatrimoine(); // Affichage du patrimoine au 26 juin 2024

// Mise à jour de la date du patrimoine au 14 juillet 2024
patrimoineIlo.setPatrimoineWithDate('2024-07-14');
patrimoineIlo.showPatrimoine(); // Affichage du patrimoine au 14 juillet 2024