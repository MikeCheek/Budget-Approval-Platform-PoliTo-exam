import React from 'react';
import PropTypes from 'prop-types';
import { MAX_SCORE } from '../../utilities/constants.mjs';
import CancelButton from '../atoms/CancelButton';

const Stars = ({ rating, updateRating }) => {
  const canExpress = rating === 0;

  const handleUpdate = (rate) => {
    if (canExpress) updateRating(rate);
  };

  return (
    <>
      {[...Array(MAX_SCORE)].map((_, index) => (
        <i
          key={index}
          className={index < rating ? 'bi bi-heart-fill me-2 text-red' : 'bi bi-heart me-2'}
          style={canExpress ? { cursor: 'pointer' } : {}}
          onClick={() => handleUpdate(index + 1)}
        />
      ))}
      {!canExpress ? <CancelButton title="Revoke preference" onClick={() => updateRating(0)} smaller /> : <></>}
    </>
  );
};

Stars.propTypes = {
  rating: PropTypes.number,
  updateRating: PropTypes.func,
};

export default Stars;
