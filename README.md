# Gestionnaire de Patrimoine Économique

Cette application permet de décrire et de projeter le patrimoine économique d'un étudiant de HEI. L'objectif est de maximiser les trois principales possessions : l'argent, les biens matériels et le train de vie.

## Fonctionnalités

- **Person** : Représente une personne avec un nom.
- **Argent** : Représente les actifs financiers d'une personne (espèces, compte bancaire courant, compte bancaire épargne).
- **Materiel** : Représente les biens matériels possédés par une personne (matériel informatique, vêtements).
- **TrainDeVie** : Représente les dépenses courantes d'une personne (loyer, nourriture, frais de transport, vacances).
- **Patrimoine** : Regroupe tous les actifs et les dépenses d'une personne, permettant de suivre l'évolution de son patrimoine au fil du temps.

## Exemple d'utilisation

```javascript
// Importation des modules nécessaires
import Argent from "./models/Argent.js";
import Materiel from "./models/Materiels.js";
import TrainDeVie from "./models/TrainDeVie.js";
import Person from './models/Person.js';
import Patrimoine from "./models/Patrimoine.js";

// Création d'une personne
let p1 = new Person('tsong');

// Création des actifs financiers pour la personne
let ar1 = new Argent(p1, "Espèces", 500000);
let ar2 = new Argent(p1, "Compte bancaire courant", 1000000);
let ar3 = new Argent(p1, "Compte bancaire épargne", 2500000, 10);

// Création des biens matériels pour la personne
let mat1 = new Materiel(p1, "Ordinateur", 700000, 10);
let mat2 = new Materiel(p1, "Vêtement", 50000, 25);

// Création des dépenses courantes pour la personne
let tr1 = new TrainDeVie(p1, "loyer", 300000);
let tr2 = new TrainDeVie(p1, "nourriture", 130000);
let tr3 = new TrainDeVie(p1, "frais de transport", 70000);
let tr4 = new TrainDeVie(p1, "vacances", 200000);

// Création du patrimoine de la personne à une date donnée
let pat1 = new Patrimoine(p1, '2024-07-10', []);

// Ajout des actifs financiers au patrimoine
pat1.addPossession(ar1);
pat1.addPossession(ar2);
pat1.addPossession(ar3);

// Ajout des biens matériels au patrimoine
pat1.addPossession(mat1);
pat1.addPossession(mat2);

// Ajout des dépenses courantes au patrimoine
pat1.addPossession(tr1);
pat1.addPossession(tr2);
pat1.addPossession(tr3);
pat1.addPossession(tr4);

// Affichage du patrimoine actuel
pat1.showPatrimoine(); // Affiche le patrimoine au 10 juillet 2024

// Mise à jour de la date du patrimoine
pat1.setPatrimoineWithDate('2034-08-20');

// Affichage du patrimoine à la nouvelle date
pat1.showPatrimoine(); // Affiche le patrimoine au 20 août 2034
```

### Exemple : Calcul du Patrimoine de Ilo

Ilo est un étudiant. À la date du 13 mai 2024, son patrimoine est composé des possessions suivantes :

- 400 000 Ar en espèces
- 200 000 Ar sur son compte épargne
- 600 000 Ar sur son compte courant
- 1 ordinateur acheté à 2 000 000 Ar le 26 octobre 2021, qui perd 10% de sa valeur chaque année
- Des vêtements évalués à 1 000 000 Ar le 1er janvier 2024, qui perdent 20% de leur valeur chaque année
- Un train de vie mensuel total de 500 000 Ar, financé par l'argent du compte courant

Pour calculer la valeur du patrimoine de Ilo le 26 juin 2024 et le 14 juillet 2024, nous utilisons les méthodes de l'application pour simuler l'évolution de ses possessions et de ses finances sur cette période.

## Voici un exemple de code pour calculer et afficher le patrimoine de Ilo à différentes dates :

```javascript
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
let compteEpargne = new Argent(ilo, "Compte bancaire épargne", 200000);
let compteCourant = new Argent(ilo, "Compte bancaire courant", 600000, 10);

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
```
