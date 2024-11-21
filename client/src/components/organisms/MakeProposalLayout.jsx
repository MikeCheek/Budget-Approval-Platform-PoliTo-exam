import { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../../API';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import PropTypes from 'prop-types';
import { isValidEUR } from '../../utilities/constants.mjs';
import Budget from '../atoms/Budget';

const MakeProposalLayout = ({ process }) => {
  const [cost, setCost] = useState();
  const [description, setDescription] = useState();
  const [errors, setErrors] = useState([]);

  const { setFeedback, setFeedbackFromError } = useFeedbackContext();

  const navigate = useNavigate();
  const location = useLocation();

  const nextPage = location.state?.nextpage || '/process';

  const validateForm = () => {
    const validationErrors = {};
    if (process && process.budget && cost > process.budget)
      validationErrors.cost = 'Cost of proposal cannot be higher than the budget';
    if (cost < 0) validationErrors.cost = 'Cost cannot be a negative number!';
    if (!isValidEUR(cost)) {
      validationErrors.cost = 'Cost must be in EUR';
    }
    if (description.trim() == '') validationErrors.description = 'Description cannot be empty';

    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    API.makeProposal(description, cost, process.id)
      .then(() => {
        setFeedback('Proposal made!');
        navigate('/process');
      })
      .catch((err) => setFeedbackFromError(err));
  };

  return (
    <>
      {process ? <Budget amount={process.budget} /> : <></>}
      <h1 className="mt-5">How do you want to spend the budget?</h1>
      <Form className="block-example rounded mt-4 mb-0 px-5 py-4 form-padding" onSubmit={handleSubmit}>
        <Form.Group className="mb-3 d-flex flex-row align-items-center justify-content-center gap-3">
          <Col xs lg="2">
            <Form.Label>Cost</Form.Label>
          </Col>
          <Col xs lg="2">
            <Form.Control
              className={errors.cost ? 'wrong-field' : ''}
              type="number"
              required={true}
              step={0.01}
              // value={cost}
              onChange={(event) => setCost(event.target.value === '' ? 0 : event.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group className="mb-3 d-flex flex-row align-items-center justify-content-center gap-3">
          <Col xs lg="2">
            <Form.Label>Description</Form.Label>
          </Col>
          <Col xs lg="2">
            <Form.Control
              className={errors.description ? 'wrong-field' : ''}
              type="text"
              required={true}
              // value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Col>
        </Form.Group>

        {Object.keys(errors).length > 0 ? (
          <div className="pt-1 pb-2 text-danger">
            {Object.keys(errors).map((err, index) => (
              <p key={index}>
                <b>{'Error ' + (index + 1) + ': '}</b>
                {errors[err]}
              </p>
            ))}
          </div>
        ) : (
          ''
        )}

        <Button className="my-3" variant="green" type="submit">
          Propose
        </Button>
        <Link className="btn btn-red mx-2 my-3" to={nextPage}>
          Cancel
        </Link>
      </Form>
    </>
  );
};

MakeProposalLayout.propTypes = {
  process: PropTypes.object,
};

export default MakeProposalLayout;
