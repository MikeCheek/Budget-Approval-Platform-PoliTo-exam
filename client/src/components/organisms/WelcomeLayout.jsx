import { Col, Container, Image, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Welcome from '../../assets/welcome.svg';

const WelcomeLayout = () => {
  return (
    <Container fluid>
      <Row className="mt-5 justify-content-center">
        <Col>
          <Image src={Welcome} style={{ width: '30%' }} title="Welcome" />
        </Col>
      </Row>
      <Stack direction="horizontal" gap={3} className="mt-5 align-items-center justify-content-center">
        <Link to="/login" className="btn btn-green">
          Log in to participate
        </Link>
        <p className="m-0">or</p>
        <Link to="/process" className="btn btn-tertiary text-decoration-underline">
          Navigate as a guest
        </Link>
      </Stack>
    </Container>
  );
};
export default WelcomeLayout;
