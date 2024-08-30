import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from 'react-router-dom';

const UpdatePossessionPage = ({people,setPeople, setPatrimoines, patrimoines}) => {
//   const { personName } = useParams();
  const { personName, libelleValue } = useParams();

  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedPersonPossessions, setSelectedPersonPossessions] = useState([]);
  const [possession, setPossession] = useState('');


  const navigate = useNavigate();

  const [type, setType] = useState('');
  const [typeArgent, setTypeArgent] = useState('');
  const [libelle, setLibelle] = useState(libelleValue);
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [interestRate, setInterestRate] = useState('');
  const [depreciationRate, setDepreciationRate] = useState('');
  const [getAmountDate, setGetAmountDate] = useState(0);

  useEffect(() => {
    const person = people.find(p => p.name === personName);
    if (person) {
        setSelectedPerson(person)
        const patrimoine = patrimoines.find(p => p.person === person.name);
        
        if (patrimoine) {
            setSelectedPersonPossessions(patrimoine.possessions);
            patrimoine.possessions.forEach(p => {
                if (p.libelle === libelleValue) {
                    setPossession(p);
                }
            });
        }
    }

    setType(possession.type);
    setTypeArgent(possession.typeArgent);
    setLibelle(possession.libelle);
    setAmount(possession.amount);
    setStartDate(possession.startDate);
    setEndDate(possession.endDate);
    setInterestRate(possession.interestRate);
    setDepreciationRate(possession.depreciationRate);
    setGetAmountDate(possession.getAmountDate);
    


  }, [possession]);


  const handleUpdatePossession = async () => {
    let newPossession = { type,typeArgent, libelle, amount, startDate, endDate, interestRate, depreciationRate, getAmountDate };
  
    switch (type) {
      case "Argent":
        if (typeArgent === "Epargne") {
          newPossession = { type, typeArgent, libelle, amount, startDate, endDate, interestRate };
        } else {
          newPossession = { type, typeArgent, libelle, amount, startDate, endDate, getAmountDate };
        }
        break;
      case "Materiel":
        newPossession = { type, libelle, amount, startDate, endDate, depreciationRate };
        break;
      case "TrainDeVie":
        newPossession = { type, libelle, amount, startDate, endDate, getAmountDate };
        break;
      default:
        newPossession = { type, libelle, amount, startDate, endDate, interestRate, depreciationRate };
        break;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/possessions/${selectedPerson.name}`);
      const personPatrimoine = await response.json();
      if (!personPatrimoine || !personPatrimoine.possessions) {
        throw new Error('Invalid data structure');
      }
  
      // const updatedPossessions = [...personPatrimoine.possessions, newPossession];
    //   const updatedPossessions = personPatrimoine.possessions.filter(p => {p.libelle==libelle?newPossession:p});
      let updatedPossessions = [];
      personPatrimoine.possessions.forEach(p => {
        if (p.libelle === libelle) {
            updatedPossessions.push(newPossession)
        } else {
            updatedPossessions.push(p)
        }
      });

      await fetch(`http://localhost:5000/patrimoine/${personPatrimoine.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ possessions: updatedPossessions }),
      });
  
      setPatrimoines(patrimoines.map(patrimoine => patrimoine.person === selectedPerson
        ? { ...patrimoine, possessions: updatedPossessions }
        : patrimoine
      ));
  
      navigate(`/possessions/${selectedPerson.name}`)
  
    } catch (error) {
      console.error('Error adding possession:', error);
    }
  };

  return (
    <div className="mt-5 p-5 ">
      <h2 className='mt-4 p-2  text-center'>Modifier la Possession <span>{libelle}</span> de {personName}</h2>
      <div className='d-flex justify-content-center'>
      <Form className='w-50'>
          <Form.Group controlId="formPossessionType">
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled
            >
              <option>Argent</option>
              <option>Materiel</option>
              <option>TrainDeVie</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formPossessionName" className="mt-3">
            <Form.Label>Libelle</Form.Label>
            {type === 'Argent' && (
              <Form.Control
                as="select"
                value={libelle}
                placeholder="Libelle de la possession"
                onChange={(e) => setLibelle(e.target.value)}
                disabled
              >
                <option>Libelle de la possession</option>
                <option>Especes</option>
                <option>Courant</option>
                <option>Epargne</option>
              </Form.Control>
            )}
            {type !== 'Argent' && (
              <Form.Control
                type="text"
                placeholder="Libelle de la possession"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                disabled
              />
            )}
          </Form.Group>
          <Form.Group controlId="formPossessionAmount" className="mt-3">
            <Form.Label>Montant</Form.Label>
            <Form.Control
              type="number"
              placeholder="Montant"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              disabled
            />
          </Form.Group>
          <Form.Group controlId="formDateDebut" className="mt-3">
            <Form.Label>Date de Début</Form.Label>
            <div>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                disabled
              />
            </div>
          </Form.Group>
          <Form.Group controlId="formDateFin" className="mt-3">
            <Form.Label>Date Fin</Form.Label>
            <div>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>
          </Form.Group>
          {type === 'Argent' && libelle === 'Epargne' &&(
            <Form.Group controlId="formInterestRate" className="mt-3">
              <Form.Label>Taux d'Intérêt</Form.Label>
              <Form.Control
                type="number"
                placeholder="Taux d'Intérêt"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                disabled
              />
            </Form.Group>
          )}
          {type === 'Materiel' && (
            <Form.Group controlId="formDepreciationRate" className="mt-3">
              <Form.Label>Taux de Dépréciation</Form.Label>
              <Form.Control
                type="number"
                placeholder="Taux de Dépréciation"
                value={depreciationRate}
                onChange={(e) => setDepreciationRate(parseFloat(e.target.value))}
                disabled
              />
            </Form.Group>
          )}

          {((type=== "Argent" && libelle === "Courant") || type === "TrainDeVie") && (
            <Form.Group controlId="formGetAmountDate" className="mt-3">
                <Form.Label>Jour</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Jour"
                  value={getAmountDate}
                  disabled
                  onChange={(e) => setGetAmountDate(parseFloat(e.target.value))}
                />
              </Form.Group>
          )}
          <Button variant="primary" onClick={handleUpdatePossession} className="mt-3">
            Mettre a jour
          </Button>
        </Form>
        </div>
    </div>
  );
};

export default UpdatePossessionPage;
