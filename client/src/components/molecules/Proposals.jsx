import React, { useEffect, useState } from 'react';
import API from '../../API';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import { Button, Col, Image, Row, Table } from 'react-bootstrap';
import { MAX_PROPOSALS } from '../../utilities/constants.mjs';
import Loader from '../atoms/Loader';
import { Link } from 'react-router-dom';
import ProposalRow from './ProposalRow';
import { useModalContext } from '../../contexts/ModalContext';
import Propose from '../../assets/propose.svg';
import PropTypes from 'prop-types';

const Proposals = ({ budget }) => {
  const [proposals, setProposals] = useState();
  const [refresh, setRefresh] = useState(0);

  const { showModal, closeModal } = useModalContext();
  const { setFeedback, setFeedbackFromError } = useFeedbackContext();

  const refetch = () => setRefresh((r) => (r + 1) % 2);

  const deleteProposal = (id) => {
    API.deleteProposal(id)
      .then(() => setFeedback(`Proposal ${id} deleted`))
      .catch((err) => setFeedbackFromError(err))
      .finally(() => refetch())
      .finally(() => closeModal());
  };

  const handleDelete = (id) => {
    showModal('Are you sure to delete this proposal?', () => deleteProposal(id));
  };

  useEffect(() => {
    API.getUserProposals()
      .then((data) => setProposals(data ? data : []))
      .catch((err) => setFeedbackFromError(err));
  }, [refresh]);

  const svg = <Image src={Propose} style={{ width: '20%' }} title="Propose" />;

  return proposals === undefined ? (
    <Loader />
  ) : (
    <>
      {proposals.length === 0 ? (
        <Row className="mt-3 justify-content-center">
          <Col>
            {svg}
            <h2 className="pb-3">You didn't make a proposal yet</h2>
          </Col>
        </Row>
      ) : (
        <>
          {svg}
          <h2 className="pb-3">Your proposals</h2>
          <Table hover className="mx-auto" style={{ width: '80%' }}>
            <thead>
              <tr>
                <th className="col-1">#</th>
                <th className="col-2">Cost</th>
                <th className="col-3">Description</th>
                <th className="col-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal, key) => (
                <ProposalRow
                  key={key}
                  position={key + 1}
                  proposal={proposal}
                  deleteAction={() => handleDelete(proposal.id)}
                  budget={budget}
                />
              ))}
            </tbody>
          </Table>
        </>
      )}
      {proposals.length < MAX_PROPOSALS ? (
        <Link to="/proposal" className="btn btn-green">
          Make proposal
        </Link>
      ) : (
        <p>You have reached the max number of proposals</p>
      )}
    </>
  );
};

Proposals.propTypes = {
  budget: PropTypes.number,
};

export default Proposals;
