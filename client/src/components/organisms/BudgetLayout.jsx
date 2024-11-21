import { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../../API';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import { isValidEUR } from '../../utilities/constants.mjs';

const BudgetLayout = () => {
  const [budget, setBudget] = useState();
  const [errors, setErrors] = useState([]);
  const { setFeedback, setFeedbackFromError, shouldRefresh } = useFeedbackContext();

  const navigate = useNavigate();
  const location = useLocation();

  const nextPage = location.state?.nextpage || '/process';

  const validateForm = () => {
    const validationErrors = {};

    if (budget < 0) {
      validationErrors.budget = 'Budget cannot be a negative number!';
    }

    if (!isValidEUR(budget)) {
      validationErrors.budget = 'Budget must be in EUR';
    }

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

    API.setBudget(budget)
      .then(() => {
        setFeedback('Budget defined correctly. Moving to next phase');
        shouldRefresh();
        navigate('/process');
      })
      .catch((err) => setFeedbackFromError(err));
  };

  return (
    <>
      <h1 className="mt-5">How much can we spend?</h1>
      <Form className="block-example rounded mt-4 mb-0 px-5 py-4 form-padding" onSubmit={handleSubmit}>
        <Form.Group className="mb-3 d-flex flex-row align-items-center justify-content-center gap-3">
          <Form.Label>Budget</Form.Label>
          <Col xs lg="2">
            <Form.Control
              className={errors.budget ? 'wrong-field' : ''}
              type="number"
              required={true}
              step={0.01}
              // value={budget}
              onChange={(event) => setBudget(event.target.value === '' ? 0 : event.target.value)}
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
          Save
        </Button>
        <Link className="btn btn-red mx-2 my-3" to={nextPage}>
          Cancel
        </Link>
      </Form>
    </>
  );
};

export default BudgetLayout;
