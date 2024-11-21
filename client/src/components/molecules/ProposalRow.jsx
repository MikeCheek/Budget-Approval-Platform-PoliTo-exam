import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ModifyButton from '../atoms/ModifyButton';
import DeleteButton from '../atoms/DeleteButton';
import { Col, Form, Row } from 'react-bootstrap';
import ConfirmButton from '../atoms/ConfirmButton';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import API from '../../API';
import CancelButton from '../atoms/CancelButton';
import { CURRENCY, isValidEUR } from '../../utilities/constants.mjs';

const ProposalRow = ({ position, proposal, deleteAction, budget }) => {
  const [edit, setEdit] = useState(false);
  const [cost, setCost] = useState(proposal.cost);
  const [description, setDescription] = useState(proposal.description);
  const [errors, setErrors] = useState([]);

  const { setFeedback, setFeedbackFromError, shouldRefresh } = useFeedbackContext();

  const validateForm = () => {
    const validationErrors = {};

    if (budget && cost > budget) validationErrors.cost = 'Cost of proposal cannot be higher than the budget';
    if (cost < 0) validationErrors.cost = 'Cost cannot be a negative number!';
    if (!isValidEUR(cost)) {
      validationErrors.cost = 'Cost must be in EUR';
    }
    if (!description || description.trim() == '') validationErrors.description = 'Description cannot be empty';

    return validationErrors;
  };

  const handleCancel = () => {
    setErrors([]);
    setCost(proposal.cost);
    setDescription(proposal.description);
    setFeedback('No changes made');
    setEdit(false);
  };

  const handleSubmit = () => {
    if (cost === proposal.cost && description === proposal.description) {
      setFeedback('No changes made');
      setEdit(false);
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    API.editProposal(proposal.id, description, cost)
      .then(() => {
        setFeedback('Proposal modified!');
        setEdit(false);
        shouldRefresh();
      })
      .catch((err) => setFeedbackFromError(err, false));
  };

  return (
    <tr className="mt-3 justify-content-center">
      <td>{position}</td>
      <td>
        {edit ? (
          <Form.Control
            className={errors.cost ? 'wrong-field' : ''}
            type="number"
            step={0.01}
            required={true}
            defaultValue={cost}
            // value={cost}
            onChange={(event) => setCost(event.target.value === '' ? 0 : event.target.value)}
          />
        ) : (
          proposal.cost + ' ' + CURRENCY
        )}
        {Object.keys(errors).length > 0 && errors.cost ? (
          <div className="pt-1 pb-2">
            <p className="text-danger">
              <b>{'Error: '}</b>
              {errors.cost}
            </p>
          </div>
        ) : (
          <></>
        )}
      </td>
      <td>
        {edit ? (
          <Form.Control
            className={errors.description ? 'wrong-field' : ''}
            type="text"
            required={true}
            defaultValue={description}
            // value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        ) : (
          proposal.description
        )}
        {Object.keys(errors).length > 0 && errors.description ? (
          <div className="pt-1 pb-2 text-danger">
            <p>
              <b>{'Error: '}</b>
              {errors.description}
            </p>
          </div>
        ) : (
          <></>
        )}
      </td>
      <td>
        {edit ? (
          <>
            <ConfirmButton title="Save edits" onClick={handleSubmit} />
            <CancelButton title="Cancel edits" onClick={handleCancel} />
          </>
        ) : (
          <>
            <ModifyButton title="Edit proposal" onClick={() => setEdit(true)} />
            <DeleteButton title="Delete proposal" onClick={deleteAction} />
          </>
        )}
      </td>
    </tr>
  );
};

ProposalRow.propTypes = {
  position: PropTypes.number,
  proposal: PropTypes.object,
  deleteAction: PropTypes.func,
  budget: PropTypes.number,
};

export default ProposalRow;
