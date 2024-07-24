
import Possession from "./Possession.js";
class Patrimoine {
  constructor(possesseur, date, possessions) {
    this.possesseur  = possesseur;
    this.date = date
    this.possessions = possessions; // [Possession, Possession, ...]
  }

  getPossesseur() {
    return this.possesseur;
  }
  getDate() {
    return this.date;
  }
  getPossessions() {
    let allPossessions = []
    this.possessions.forEach(element => {
        allPossessions.push(element.getLibelle())
    });
    
    return allPossessions;
  }

  addPossession(possession) {
    this.possessions.push(possession);
  }

  removePossession(possession) {
    this.possessions = this.possessions.filter(p => p.libelle !== possession.libelle);
  }

  poss = this.possessions;

  


  
}

export default Patrimoine;
