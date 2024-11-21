import { Col, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NotFound from '../../assets/not-found.svg';

const NotFoundLayout = () => {
  return (
    <>
      <Row>
        <Col>
          <h1 className="my-5">Page not found!</h1>
          <Image src={NotFound} title="Not found" style={{ width: '30%' }} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Link to="/" className="btn btn-green my-5">
            Go Home!
          </Link>
        </Col>
      </Row>
    </>
  );
};

export default NotFoundLayout;
