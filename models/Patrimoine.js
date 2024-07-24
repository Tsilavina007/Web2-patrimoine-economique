
import Possession from "./Possession.js";
class Patrimoine {
  constructor(possesseur, date, possessions) {
    this.possesseur  = possesseur;
    this.date = new Date(date);
    this.possessions = possessions; // [Possession, Possession, ...]
  }

  getPossesseur() {
    return this.possesseur;
  }
  getDatePatrimoine() {
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

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Mois 0-indexé
    const year = date.getFullYear();
  
    // Ajouter un zéro devant les jours et mois inférieurs à 10
    const dayFormatted = day < 10 ? `0${day}` : day;
    const monthFormatted = month < 10 ? `0${month}` : month;
  
    return `${dayFormatted}/${monthFormatted}/${year}`;
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

    console.log("Patrimoine de " +this.getPossesseur().getName() +" le " + this.formatDate(this.getDatePatrimoine())+"\n\n"+showArgent +"\n" + showMateriels + "\n" + showTrainDeVie);
  }
  differenceInMonths(date1, date2) {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth(); // 0-indexé
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth(); // 0-indexé

    const yearDiff = year2 - year1;
    const monthDiff = month2 - month1;

    return (yearDiff * 12) + monthDiff;
  }

  differenceInYears(date1, date2) {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();

    return Math.abs(year2 - year1);
}

  getPatrimoineWithDate(newDate) {
    const monthsDifference = this.differenceInMonths(this.getDatePatrimoine(), new Date(newDate));
    const yearDifference = this.differenceInYears(this.getDatePatrimoine(), new Date(newDate));

    console.log(monthsDifference); 
    console.log(yearDifference); 
  }

}


export default Patrimoine;
