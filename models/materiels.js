import Possession from "./Possession.js";

class Materiel extends Possession {
    constructor(possesseur, libelle, prix, taux_d_acroissement=null) {
        super(possesseur, libelle,);
        this.type = 'materiel';
        this.prix = prix;
        this.taux_d_acroissement= taux_d_acroissement;
    }
}

export default Materiel;