import PropTypes from 'prop-types';
import { Button, Col, Container, Row } from 'react-bootstrap/';
import LoginButton from '../atoms/LoginButton';
import LogoutButton from '../atoms/LogoutButton';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ loggedIn, logout, user }) => {
  const location = useLocation();
  const hideLogin = location.pathname === '/login' || location.pathname === '/';
  return (
    <header className="py-1 py-md-3 border-bottom bg-purple">
      <Container fluid className="gap-3 align-items-center">
        <Row>
          <Col>
            <Link
              to="/"
              className="d-flex align-items-center justify-content-center justify-content-md-start h-100 link-light text-decoration-none"
              style={{ width: 'fit-content' }}
            >
              <i className="bi bi-piggy-bank me-2 h2"></i>
              <span className="h5 mb-0">Budget Assignment</span>
            </Link>
          </Col>
          {hideLogin ? (
            <></>
          ) : (
            <Col className="d-flex align-items-center justify-content-end gap-3">
              {loggedIn && user ? <p className="text-white my-0">{user.name}</p> : <></>}
              <span>{loggedIn ? <LogoutButton logout={logout} /> : <LoginButton />}</span>
            </Col>
          )}
        </Row>
      </Container>
    </header>
  );
};

Header.propTypes = {
  logout: PropTypes.func,
  user: PropTypes.object,
  loggedIn: PropTypes.bool,
};

export default Header;
