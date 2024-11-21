import React from 'react';
import { PHASE } from '../../utilities/constants.mjs';
import PropTypes from 'prop-types';

const Phase = ({ number }) => {
  return <h1 className="mb-5">{PHASE[number]}</h1>;
};

Phase.propTypes = {
  number: PropTypes.number,
};

export default Phase;
