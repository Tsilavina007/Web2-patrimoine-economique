// src/components/Home.js
import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './Home.css'; // Assurez-vous d'importer le fichier CSS

const Home = ({ handleShowPossessions, person }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <Card className="card-custom">
            <Card.Body>
              <Card.Title as="h1" className="card-title-custom">
                Bienvenue dans le Gestionnaire de Patrimoine Économique
              </Card.Title>
              <Card.Text className="card-text-custom">
                Cette application permet de décrire et de projeter le patrimoine économique d'un étudiant de HEI. 
                L'objectif est de maximiser les trois principales possessions : l'argent, les biens matériels et le train de vie.
              </Card.Text>
              <Button variant="primary" className="btn-custom" onClick={() => handleShowPossessions(person)}>
                Aficher la patroine de Ilo
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
