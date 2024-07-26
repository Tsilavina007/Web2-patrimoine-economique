import Possession from "./Possession.js";

class Argent extends Possession {
    constructor(possesseur, libelle, solde, taux_de_benefice=null) {
        super(possesseur, libelle,);
        this.type = 'argent';
        this.solde = solde;
        this.taux_de_benefice= taux_de_benefice;
    }

    
}


export default Argent;