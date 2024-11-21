import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useModalContext } from '../../contexts/ModalContext';
import API from '../../API';
import { useFeedbackContext } from '../../contexts/FeedbackContext';

const NextPhase = ({ phase }) => {
  const { showModal, closeModal } = useModalContext();
  const { setFeedbackFromError, shouldRefresh } = useFeedbackContext();

  const goNextPhase = () => {
    API.nextPhase()
      .then(() => {
        shouldRefresh();
      })
      .catch((err) => setFeedbackFromError(err))
      .finally(() => closeModal());
  };

  const restart = () => {
    API.restartProcess()
      .then(() => shouldRefresh())
      .catch((err) => setFeedbackFromError(err))
      .finally(() => closeModal());
  };

  const handleGoNextPhase = () => {
    showModal('Going to next phase will close this one. Are you sure?', goNextPhase);
  };

  const handleRestart = () => {
    showModal("Restarting the process will erase previous one's data. Are you sure?", restart);
  };

  return (
    <span className="position-absolute top-1 start-auto m-0 p-0 end-0" style={{ width: 'fit-content' }}>
      {phase === 0 ? (
        <Link to="/budget" className="btn btn-green rounded-0" style={{ paddingRight: '3rem' }}>
          DEFINE BUDGET
        </Link>
      ) : phase === 1 || phase === 2 ? (
        <Button onClick={handleGoNextPhase} className="btn btn-red rounded-0" style={{ paddingRight: '3rem' }}>
          GO NEXT PHASE <i className="bi bi-arrow-right" />
        </Button>
      ) : (
        <Button onClick={handleRestart} className="btn btn-red rounded-0" style={{ paddingRight: '3rem' }}>
          RESTART PROCESS
        </Button>
      )}
    </span>
  );
};

NextPhase.propTypes = {
  phase: PropTypes.number,
};

export default NextPhase;
