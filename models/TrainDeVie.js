import Possession from "./Possession.js";

class TraiDeVie extends Possession {
    constructor(possesseur, libelle, cout) {
        super(possesseur, libelle);
        this.type = 'train_de_vie';
        this.cout = cout;
    }
}

export default TraiDeVie;