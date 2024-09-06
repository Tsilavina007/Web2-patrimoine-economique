import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const UpdatePossessionPage = ({people, patrimoines}) => {
//   const { personName } = useParams();
  const { libelleValue } = useParams();

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
    const person = people;
    if (person) {
        setSelectedPerson(person)
        const patrimoine = patrimoines;
        
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

      await fetch(`http://localhost:5000/possession/${libelleValue}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateLibelle: newPossession.libelle, updateDateFin:newPossession.endDate}),
      });
  
      navigate(`/possessions`)
  
    } catch (error) {
      console.error('Error adding possession:', error);
    }
  };

  return (
    <div className="container p-5 bg-light rounded" style={{marginTop:"100px", width:"auto"}}>
  <h2 className='mt-1 p-2 text-center text-primary'>Modifier la Possession <span className="text-secondary">{libelleValue}</span></h2>

  <div className='d-flex justify-content-center'>
    <Form className='w-50'>
      {/* Type */}
      <Form.Group controlId="formPossessionType" className="mb-4">
        <Form.Label className="fw-bold">Type</Form.Label>
        <Form.Control
          as="select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled
          className=" shadow-sm"
        >
          <option>Argent</option>
          <option>Materiel</option>
          <option>TrainDeVie</option>
        </Form.Control>
      </Form.Group>

      {/* Libelle */}
      <Form.Group controlId="formPossessionName" className="mb-4">
        <Form.Label className="fw-bold">Libelle</Form.Label>
        <Form.Control
          type="text"
          placeholder="Libelle de la possession"
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
          className=" shadow-sm"
        />
      </Form.Group>

      {/* Montant */}
      <Form.Group controlId="formPossessionAmount" className="mb-4">
        <Form.Label className="fw-bold">Montant</Form.Label>
        <Form.Control
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className=" shadow-sm"
          disabled
        />
      </Form.Group>

      {/* Date de Début */}
      <Form.Group controlId="formDateDebut" className="mb-4 d-flex flex-column">
        <Form.Label className="fw-bold">Date de Début</Form.Label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          className="form-control  shadow-sm"
          disabled
        />
      </Form.Group>

      {/* Date de Fin */}
      <Form.Group controlId="formDateFin" className="mb-4 d-flex flex-column">
        <Form.Label className="fw-bold">Date Fin</Form.Label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="dd/MM/yyyy"
          className="form-control  shadow-sm"
        />
      </Form.Group>

      {/* Interest Rate for Epargne */}
      {type === 'Argent' && libelle === 'Epargne' && (
        <Form.Group controlId="formInterestRate" className="mb-4">
          <Form.Label className="fw-bold">Taux d'Intérêt</Form.Label>
          <Form.Control
            type="number"
            placeholder="Taux d'Intérêt"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className=" shadow-sm"
            disabled
          />
        </Form.Group>
      )}

      {/* Depreciation Rate for Materiel */}
      {type === 'Materiel' && (
        <Form.Group controlId="formDepreciationRate" className="mb-4">
          <Form.Label className="fw-bold">Taux de Dépréciation</Form.Label>
          <Form.Control
            type="number"
            placeholder="Taux de Dépréciation"
            value={depreciationRate}
            onChange={(e) => setDepreciationRate(parseFloat(e.target.value))}
            className=" shadow-sm"
            disabled
          />
        </Form.Group>
      )}

      {/* Get Amount Date for Courant or TrainDeVie */}
      {((type === "Argent" && libelle === "Courant") || type === "TrainDeVie") && (
        <Form.Group controlId="formGetAmountDate" className="mb-4">
          <Form.Label className="fw-bold">Jour</Form.Label>
          <Form.Control
            type="number"
            placeholder="Jour"
            value={getAmountDate}
            onChange={(e) => setGetAmountDate(parseFloat(e.target.value))}
            className=" shadow-sm"
            disabled
          />
        </Form.Group>
      )}

      {/* Action buttons */}
      <div className='d-flex justify-content-between pt-3'>
        <Button variant="primary" onClick={handleUpdatePossession} className="mt-3">
          Mettre à jour
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/possessions`)} className="mt-3 ms-3">
          Annuler
        </Button>
      </div>
    </Form>
  </div>
</div>

  );
};

export default UpdatePossessionPage;
