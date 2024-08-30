import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PatrimoinesTable = ({ people, patrimoines, handleShowAddPossession, handleShowPossessions, handleShowConfirmDelete }) => {
  return (
<div className='mt-5 d-flex justify-content-center'>
    <Row className="mt-5 p-3 w-100">
      <Col className="d-flex justify-content-center">
        <Card style={{ width: '100%' }}>
          <Card.Header>Patrimoines des Personnes</Card.Header>
          <Card.Body>
            <Table striped bordered hover style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Personne</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {people.map((person, index) => {
                  const patrimoine = patrimoines.find(p => p.person === person.name);
                  return (
                    <tr key={index}>
                      <td>{person.name}</td>
                      <td className='d-flex justify-content-around'>
                        <Button
                          variant="secondary"
                          onClick={() => handleShowAddPossession(person)}
                        >
                          Ajouter Possession
                        </Button>
                        <Link to={`/possessions/${person.name}`}>
                          <Button
                            variant="info"
                            className="ml-2"
                          >
                            Afficher Possessions
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          onClick={() => handleShowConfirmDelete(person)}
                          className="ml-2"
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </div>
  );
};

export default PatrimoinesTable;



// // src/components/PatrimoinesTable.jsx

// import { Link } from 'react-router-dom';

// const PatrimoinesTable = ({ people, patrimoines, handleShowAddPossession, handleShowConfirmDelete }) => {
//   return (
//     <Table striped bordered hover>
//       <thead>
//         <tr>
//           <th>Nom</th>
//           <th>Possessions</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {people.map(person => (
//           <tr key={person.id}>
//             <td>{person.name}</td>
//             <td>
//               <Link to={`/possessions/${person.name}`}>Voir Possessions</Link>
//             </td>
//             <td>
//               <Button onClick={() => handleShowAddPossession(person)}>Ajouter Possession</Button>
//               <Button variant="danger" onClick={() => handleShowConfirmDelete(person)}>Supprimer</Button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// };

// export default PatrimoinesTable;
