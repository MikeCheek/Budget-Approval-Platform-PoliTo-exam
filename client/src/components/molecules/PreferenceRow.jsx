import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Stars from './Stars';
import API from '../../API';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import { CURRENCY } from '../../utilities/constants.mjs';

const PreferenceRow = ({ position, proposal, score }) => {
  const [rating, setRating] = useState(score ? score : 0);
  const { setFeedbackFromError, setFeedback } = useFeedbackContext();

  const handleChangeRating = (score) => {
    if (score === 0)
      API.deletePreference(proposal.id)
        .then(() => {
          setRating(0);
          setFeedback('Preference revoked');
        })
        .catch((err) => setFeedbackFromError(err));
    else
      API.addPreference(proposal.id, score)
        .then(() => {
          setRating(score);
          setFeedback('Preference updated');
        })
        .catch((err) => setFeedbackFromError(err));
  };

  return (
    <tr className="mt-3 justify-content-center">
      <td>{position}</td>
      <td>
        {proposal.cost} {CURRENCY}
      </td>
      <td>{proposal.description}</td>
      <td>
        <Stars rating={rating} updateRating={(rate) => handleChangeRating(rate)} />
      </td>
    </tr>
  );
};

PreferenceRow.propTypes = {
  position: PropTypes.number,
  proposal: PropTypes.object,
  score: PropTypes.number,
};

export default PreferenceRow;
