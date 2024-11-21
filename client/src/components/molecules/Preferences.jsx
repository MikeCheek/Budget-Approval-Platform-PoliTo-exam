import React, { useEffect, useState } from 'react';
import API from '../../API';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import Loader from '../atoms/Loader';
import { Col, Image, Table } from 'react-bootstrap';
import PreferenceRow from './PreferenceRow';
import Preference from '../../assets/preference.svg';

const Preferences = () => {
  const [proposals, setProposals] = useState();
  const { setFeedbackFromError } = useFeedbackContext();

  useEffect(() => {
    API.getAllProposals()
      .then((data) => setProposals(data ? data : null))
      .catch((err) => setFeedbackFromError(err));
  }, []);

  const svg = <Image src={Preference} style={{ height: '30vh' }} className="mb-4" title="Express preference" />;

  return proposals === undefined ? (
    <Loader />
  ) : proposals === null || proposals.length === 0 ? (
    <>
      {svg}
      <p>There are no proposals from other users</p>
    </>
  ) : (
    <>
      <Col className=" justify-content-center">
        <p>(You're proposals are not shown)</p>
        {svg}
        <Table hover className="mx-auto" style={{ width: '80%' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Cost</th>
              <th>Description</th>
              <th>Express preference</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal, key) => (
              <PreferenceRow key={key} position={key + 1} proposal={proposal} score={proposal.preference} />
            ))}
          </tbody>
        </Table>
      </Col>
    </>
  );
};

export default Preferences;
