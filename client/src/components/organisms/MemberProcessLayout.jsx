import { Col, Container, Image, Row } from 'react-bootstrap';
import Phase from '../atoms/Phase';
import Proposals from '../molecules/Proposals';
import PropTypes from 'prop-types';
import Preferences from '../molecules/Preferences';
import Results from '../molecules/Results';
import Loader from '../atoms/Loader';
import Wait from '../../assets/wait.svg';
import Budget from '../atoms/Budget';

const MemberProcessLayout = ({ process }) => {
  return (
    <Container fluid>
      {process === undefined ? (
        <Loader />
      ) : process === null ? (
        <Row className="mt-3 justify-content-center">
          <Col>
            <h1 className="pb-3">No process available</h1>
          </Col>
        </Row>
      ) : (
        <Row className="mt-3 justify-content-center">
          <Budget amount={process.budget} />
          <Col>
            <Phase number={process.phase} />
            {process.phase === 0 ? (
              <>
                <p className="fs-3">The proposal phase is still closed</p>
                <Image src={Wait} style={{ width: '30%' }} title="Wait" />
                <p className="fs-3 mt-4">Come back later!</p>
              </>
            ) : process.phase === 1 ? (
              <Proposals budget={process.budget} />
            ) : process.phase === 2 ? (
              <Preferences />
            ) : process.phase === 3 ? (
              <Results />
            ) : (
              <p className="text-danger">
                Something went wrong. <br />
                The process is in an unknow phase
              </p>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

MemberProcessLayout.propTypes = {
  process: PropTypes.object,
};

export default MemberProcessLayout;
