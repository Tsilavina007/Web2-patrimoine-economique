import Possession from "./models/Possession.js";
import Argent from "./models/Argent.js";
import Materiel from "./models/Materiels.js";
import TraiDeVie from "./models/TrainDeVie.js";

import Person from './models/Person.js';
import Patrimoine from "./models/Patrimoine.js";


let p1 = new Person('tsong');

let ar1 = new Argent(p1, "Espèces", 500000);
let ar2 = new Argent(p1, "Compte bancaire courant", 1000000);
let ar3 = new Argent(p1, "Compte bancaire épargne", 2500000, 10);

let mat1 = new Materiel(p1, "Ordinateur", 700000, 10);
let mat2 = new Materiel(p1, "Vetement", 50000, 25);

let tr1 = new TraiDeVie(p1, "loyer", 300000);
let tr2 = new TraiDeVie(p1, "nourriture", 130000);
let tr3 = new TraiDeVie(p1, "frais de transport", 70000);
let tr4 = new TraiDeVie(p1, "vacances", 4000000);


let pat1 = new Patrimoine(p1, '2024-07-10', []);

pat1.addPossession(ar1);
pat1.addPossession(ar2);
pat1.addPossession(ar3);

pat1.addPossession(mat1);
pat1.addPossession(mat2);

pat1.addPossession(tr1);
pat1.addPossession(tr2);
pat1.addPossession(tr3);
pat1.addPossession(tr4);

// console.log(pat1.getPossessionsWithTypes());

// pat1.showPatrimoine();

// pat1.removePossession(pos2);
// console.log(pat1.getPossessionsWithTypes());

pat1.getPatrimoineWithDate('2024-08-20')