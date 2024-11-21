import { useState } from 'react';
import { Alert, Button, Col, Form, Image, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Login from '../../assets/login.svg';

const LoginLayout = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props
      .login(credentials)
      .then(() => navigate('/'))
      .catch((err) => {
        if (err.message === 'Unauthorized') setErrorMessage('Invalid username and/or password');
        else setErrorMessage(err.message);
        setShow(true);
      });
  };

  return (
    <Row className="mt-3 vh-100 justify-content-center">
      <Col>
        <h1 className="pb-3">Login</h1>
        <Row className="align-items-center justify-content-center">
          <Col md={4}>
            <Image src={Login} className="w-100" title="Login" />
          </Col>
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <Alert dismissible show={show} onClose={() => setShow(false)} variant="danger">
                {errorMessage}
              </Alert>
              <Form.Group className="mb-3 text-start" controlId="username">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={username}
                  placeholder="name@email.com"
                  onChange={(ev) => setUsername(ev.target.value)}
                  required={true}
                />
              </Form.Group>
              <Form.Group className="mb-3 text-start" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  placeholder=""
                  onChange={(ev) => setPassword(ev.target.value)}
                  required={true}
                  minLength={3}
                />
              </Form.Group>
              <Button className="mt-3" variant="green" type="submit">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

LoginLayout.propTypes = {
  login: PropTypes.func,
};

export default LoginLayout;
