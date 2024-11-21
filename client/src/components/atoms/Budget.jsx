import React from 'react';
import PropTypes from 'prop-types';
import { CURRENCY } from '../../utilities/constants.mjs';

const Budget = ({ amount }) => {
  return amount ? (
    <p
      className="fs-5 position-absolute top-0 mt-3 p-2 rounded text-white"
      style={{ width: 'fit-content', left: '50%', transform: 'translateX(-50%)' }}
    >
      Budget: {amount} {CURRENCY}
    </p>
  ) : (
    <></>
  );
};

Budget.propTypes = {
  amount: PropTypes.number,
};

export default Budget;
