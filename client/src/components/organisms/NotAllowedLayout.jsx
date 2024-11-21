import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotAllowedLayout = () => {
  return (
    <>
      <Row>
        <Col>
          <h1>You don't have the rights to visit this page</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link to="/" className="btn btn-green mt-2 my-5">
            Go Home!
          </Link>
        </Col>
      </Row>
    </>
  );
};

export default NotAllowedLayout;
