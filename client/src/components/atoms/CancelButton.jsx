import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const CancelButton = ({ title, onClick, smaller }) => {
  return smaller ? (
    <i
      className="bi bi-x-circle text-danger position-absolute right-100 ms-2"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    />
  ) : (
    <Button title={title} onClick={onClick} variant="red" className="border-0 position-absolute right-100 ms-2">
      <i className="bi bi-x-square" />
    </Button>
  );
};

CancelButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
};

export default CancelButton;
