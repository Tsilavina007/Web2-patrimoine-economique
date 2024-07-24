import Possession from "./Possession.js";
import Person from './person.js';
import Patrimoine from "./Patrimoine.js";


let p1 = new Person('tsong') ;
let pos1 = new Possession(p1, "argent", "possession 1");
let pos2 = new Possession(p1, "train de vie", "possession 2");
let pat1 = new Patrimoine(p1, '20/07/2024', [pos1])


pat1.addPossession(pos2);

// console.log(p1.getName());

// console.log(pos1.getPossesseur());

console.log(pat1.getPossessions());
// console.log(pat1.getDate());


