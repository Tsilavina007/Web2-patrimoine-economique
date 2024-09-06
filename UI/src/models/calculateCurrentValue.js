
import Argent from './possessions/Argent.js';
import BienMateriel from './possessions/BienMateriel.js';
import Flux from './possessions/Flux.js';
import Possession from './possessions/Possession.js';
import Patrimoine from './Patrimoine.js';
import Personne from './Personne.js';



const calculateCurrentValue = (possession, calculateDate) => {
    const now = new Date(calculateDate);
    const start = new Date(possession.startDate);
  
    const TYPE_ARGENT = {
      Courant: "Courant",
      Epargne: "Epargne",
      Espece: "Espece"
    };
  
    let currentValue = possession.amount;
  
    // Appliquer l'ajustement selon le type de possession
    switch (possession.type) {
      case 'Argent':
        if (possession.typeArgent === 'Epargne') {
          // Calculer les intérêts composés annuels
          const savingsAccount = new Argent(
            "Ilo", 
            possession.libelle, 
            possession.amount, 
            start, 
            null, 
            -possession.interestRate,
          TYPE_ARGENT.Epargne);
  
          currentValue = savingsAccount.getValeur(now);
  
  
        } else if (possession.typeArgent === 'Courant') {
          
          const salary = new Flux(
            "Ilo", 
            possession.libelle, 
            possession.amount, 
            start, 
            null, 
            0, 
            possession.getAmountDate);
  
          currentValue = salary.getValeur(now);
        }
        break;
  
      case 'Materiel':
        // Calculer la dépréciation pour chaque année entière
        const materiel = new Possession(
          "Ilo", 
          possession.libelle, 
          possession.amount, 
          start, 
          null, 
          possession.depreciationRate);
  
          currentValue = materiel.getValeur(now);
  
          if (currentValue <= 0) {
              currentValue = 0
          }
  
        break;
  
      case 'TrainDeVie':
        const survie = new Flux(
          "Ilo", 
          possession.libelle, 
          possession.amount, 
          start, 
          null, 
          0, 
          possession.getAmountDate);
  
        currentValue = survie.getValeur(now);
        break;
  
      default:
        currentValue = possession.amount;
        break;
    }
  
    // Arrondir la valeur actuelle à 2 décimales
    return Number(currentValue.toFixed(2));
  };

  
  export default calculateCurrentValue;