import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ConfirmButton = ({ title, onClick }) => {
  return (
    <Button title={title} onClick={onClick} variant="green" className="border-0">
      <i className="bi bi-check-square"></i>
    </Button>
  );
};

ConfirmButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
};

export default ConfirmButton;
