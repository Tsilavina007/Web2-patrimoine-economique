// src/components/Home.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Home.css';

const Home = ({ person }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <Card className="card-custom">
            <Card.Body>
              <Card.Title as="h1" className="card-title-custom">
                Patrimoine de {person.name}
              </Card.Title>
              <Card.Text className="card-text-custom">
                Cette application permet de décrire et de projeter le patrimoine économique d'un étudiant de HEI. 
                L'objectif est de maximiser les trois principales possessions : l'argent, les biens matériels et le train de vie.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
