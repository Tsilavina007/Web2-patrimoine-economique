
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

  getPossessionsWithTypes() {
    let types_argent = [];
    let types_trainDeVie = [];
    let types_materiels = [];

    this.possessions.forEach(element => {
      switch (element.getType()) {
        case 'argent':
          types_argent.push(element);
          break;
        case 'train_de_vie':
          types_trainDeVie.push(element);
          break;
        case 'materiel':
          types_materiels.push(element);
          break;      
        default:
          break;
      }
    });
    
    let types = {
      types_argent : types_argent,
      types_materiels : types_materiels,
      types_trainDeVie : types_trainDeVie
    }

    return types;
  }

  addPossession(possession) {
    this.possessions.push(possession);
  }

  removePossession(possession) {
    this.possessions = this.possessions.filter(p => p.libelle !== possession.libelle);
  }

  showPatrimoine() {
    let showArgent = '';
    let showMateriels = '';
    let showTrainDeVie = '';

    this.getPossessionsWithTypes().types_argent.forEach(element => {
      if (element.getTB() ==null) {
        showArgent += "Argent - " +element.getLibelle() + " | solde : " + element.getSolde() + "\n";
      } else {
        showArgent += "Argent - " +element.getLibelle() + " | solde : " + element.getSolde() + " | taux de benefice : " + element.getTB() + "%/ans\n";
      }
    })

    this.getPossessionsWithTypes().types_materiels.forEach(element => {
      showMateriels += "Materiels - " +element.getLibelle() +" | Prix : " + element.getPrix() + " | Taux d'acroissement : " + element.getTA() + "%/ans\n";
    })

    this.getPossessionsWithTypes().types_trainDeVie.forEach(element => {
      showTrainDeVie += "Train De Vie - " +element.getLibelle() + " | cout : " + element.getCout () + "\n";
    })

    console.log("Patrimoine de " +this.getPossesseur().getName() +" le " + this.getDate()+"\n\n"+showArgent +"\n" + showMateriels + "\n" + showTrainDeVie);
  }

}

export default Patrimoine;
