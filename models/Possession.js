class Possession {
  constructor(possesseur, type, libelle) {
    this.possesseur = possesseur;
    this.type = type;
    this.libelle = libelle;
  }

  getPossesseur() {
    return this.possesseur;
  }

  getLibelle() {
    return this.libelle;
  }
}


export default Possession;