class Person {
  
  constructor(nom) {
    this.nom = nom;
  }

  getName(){
    return this.nom;
  }
}

// module.exports = Person;
export default Person;