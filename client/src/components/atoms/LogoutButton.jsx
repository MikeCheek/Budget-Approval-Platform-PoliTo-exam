import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const LogoutButton = (props) => {
  return (
    <Button variant="outline-light" onClick={props.logout}>
      Logout
    </Button>
  );
};

LogoutButton.propTypes = {
  logout: PropTypes.func,
};

export default LogoutButton;
