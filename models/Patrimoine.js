
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
  
    return `${dayFormatted}-${monthFormatted}-${year}`;
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

    console.log("\n\n======================================\nPatrimoine de " +this.getPossesseur().getName() +" le " + this.formatDate(this.getDatePatrimoine())+"\n\n"+showArgent +"\n" + showMateriels + "\n" + showTrainDeVie);
  }

  differenceInMonths(date1, date2) {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth(); 
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth(); 

    const yearDiff = year2 - year1;
    const monthDiff = month2 - month1;

    return (yearDiff * 12) + monthDiff;
  }

  differenceInYears(date1, date2) {
    const jour1 = date1.getDate();
    const jour2 = date2.getDate();
    if (jour2 >= jour1) {      
      const dYear = this.differenceInMonths(date1, date2)/12;
      return Math.floor(dYear);
    } else { 
      const dYear = this.differenceInMonths(date1, date2)/12 - 1;
      return Math.floor(dYear);
    }
}

  setPatrimoineWithDate(newDate) {
      const monthsDifference = this.differenceInMonths(this.getDatePatrimoine(), new Date(newDate));
      const yearDifference = this.differenceInYears(this.getDatePatrimoine(), new Date(newDate));

      this.getPossessionsWithTypes().types_materiels.forEach(element => {
          if (element.getPrix() >= 0 && yearDifference >= 1 ) {
            
              let newPrix = element.getPrix() - (element.getPrix() * element.getTA()* yearDifference / 100);
              if (newPrix <= 0) {
                element.setPrix(0);
              } else {
                element.setPrix(newPrix);
              }
          }
      });


      let elementToRemove = []
      this.getPossessionsWithTypes().types_materiels.forEach(element => {
        if (element.getPrix() == 0) {
          elementToRemove.push(element);
        }
      });
      elementToRemove.forEach(element => {
        this.removePossession(element);
      });

      let sommeCout = 0;
      this.getPossessionsWithTypes().types_trainDeVie.forEach(element => {
        sommeCout += element.getCout();
      });

      this.getPossessionsWithTypes().types_argent.forEach(element => {
        if (element.getLibelle() == "Compte bancaire courant") {
            let newSolde = element.getSolde() * monthsDifference;
            if (newSolde >= sommeCout) {
              newSolde -= sommeCout * monthsDifference;
            }
            element.setSolde(newSolde)
        } else if (element.getLibelle() == "Compte bancaire épargne") {
            let newSolde = element.getSolde() * yearDifference;
            element.setSolde(newSolde)
        } 
        // else if (element.getLibelle() == "Espèces") {
        //   console.log("Especes");
        // }
    });

    this.date = new Date(newDate);
  }

}


export default Patrimoine;
