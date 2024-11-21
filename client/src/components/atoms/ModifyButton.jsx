import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ModifyButton = ({ title, onClick }) => {
  return (
    <Button title={title} onClick={onClick} variant="yellow" className="border-0 me-2">
      <i className="bi bi-pencil-square"></i>
    </Button>
  );
};

ModifyButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
};

export default ModifyButton;
