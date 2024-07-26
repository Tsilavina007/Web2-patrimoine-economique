import Possession from "./Possession.js";
import Argent from "./Argent.js";
import Materiel from "./Materiels.js";
import TraiDeVie from "./TrainDeVie.js";

import Person from './Person.js';
import Patrimoine from "./Patrimoine.js";


let p1 = new Person('tsong');

let ar1 = new Argent(p1, "Espèces", 500000);
let ar2 = new Argent(p1, "Compte bancaire courant", 1000000);
let ar3 = new Argent(p1, "Compte bancaire épargne", 2500000, 10);

let mat1 = new Materiel(p1, "Ordinateur", 700000, 10);
let mat2 = new Materiel(p1, "Vetement", 50000, 25);

let tr1 = new TraiDeVie(p1, "loyer", 300000);
let tr2 = new TraiDeVie(p1, "nourriture", 130000);
let tr3 = new TraiDeVie(p1, "frais de transport", 70000);
let tr4 = new TraiDeVie(p1, "vacances", 200000);


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

pat1.showPatrimoine();

pat1.setPatrimoineWithDate('2034-08-20')

pat1.showPatrimoine();