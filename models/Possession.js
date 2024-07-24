class Possession {
  constructor(possesseur, libelle ) {
    this.possesseur = possesseur;
    this.type = null;
    this.libelle = libelle;
    // this.solde = solde;
  }

  getPossesseur() {
    return this.possesseur;
  }

  getLibelle() {
    return this.libelle;
  }

  getType() {
    return this.type;
  }

  getSolde() {
    return this.solde;
  }

  getTB() {
    return this.taux_de_benefice;
  }
  
  getPrix() {
    return this.prix;
  }
  
  getTA() {
    return this.taux_d_acroissement;
  }

  getCout() {
    return this.cout;
  }

}

export default Possession;
