import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Results from '../molecules/Results';
import { useEffect, useState } from 'react';
import API from '../../API';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import Phase from '../atoms/Phase';
import Wait from '../../assets/wait.svg';

const AnonymousLayout = () => {
  const [phase, setPhase] = useState();
  const { setFeedbackFromError } = useFeedbackContext();

  useEffect(() => {
    API.getPhase()
      .then((p) => {
        setPhase(p);
      })
      .catch((err) => setFeedbackFromError(err));
  }, []);

  return (
    <Container fluid className="mt-3">
      {!phase || phase != 3 ? (
        <>
          <Row className="mt-3 justify-content-center">
            <Col>
              <h1 className="pb-3">The proposal definition phase is ongoing</h1>
              <Image src={Wait} style={{ width: '30%' }} title="Wait" />
            </Col>
          </Row>
          <Row>
            <Col className="mt-4">
              <Link to="/login" className="btn btn-green mt-2 my-5">
                Log in to participate
              </Link>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Phase number={3} />
          <Results hideNotApproved />
        </>
      )}
    </Container>
  );
};

export default AnonymousLayout;
