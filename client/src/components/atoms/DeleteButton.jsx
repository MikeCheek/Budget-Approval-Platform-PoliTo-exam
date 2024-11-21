import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DeleteButton = ({ title, onClick }) => {
  return (
    <Button title={title} onClick={onClick} variant="red" className="border-0">
      <i className="bi bi-trash3"></i>
    </Button>
  );
};

DeleteButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
};

export default DeleteButton;
