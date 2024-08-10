// src/components/Home.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Home.css';

const Home = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <Card className="card-custom">
            <Card.Body>
              <Card.Title as="h1" className="card-title-custom">
                Patrimoine
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
