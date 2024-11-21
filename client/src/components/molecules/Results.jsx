import React, { useEffect, useState } from 'react';
import API from '../../API';
import PropTypes from 'prop-types';
import Loader from '../atoms/Loader';
import { Col, Image, Table } from 'react-bootstrap';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import ResultsSvg from '../../assets/results.svg';
import { CURRENCY } from '../../utilities/constants.mjs';

const Results = ({ hideNotApproved }) => {
  const [approved, setApproved] = useState();
  const [notApproved, setNotApproved] = useState();

  const { setFeedbackFromError } = useFeedbackContext();

  const loading = approved === undefined || (!hideNotApproved && notApproved === undefined);
  const empty = approved === null && notApproved === null;

  useEffect(() => {
    API.getApprovedProposals()
      .then((data) => setApproved(data ? data : null))
      .catch((err) => {
        setFeedbackFromError(err);
        setApproved(null);
      })
      .finally(() => {
        if (!hideNotApproved)
          API.getNotApprovedProposals()
            .then((data) => setNotApproved(data ? data : null))
            .catch((err) => setFeedbackFromError(err));
        else setNotApproved(null);
      });
  }, []);

  return loading ? (
    <Loader />
  ) : empty ? (
    <p>There are no proposals</p>
  ) : (
    <>
      <Col className="mt-3 justify-content-center">
        {/* <h3 className="pb-3">The budget assignment process is finished.</h3> */}
        <Image src={ResultsSvg} title="Results" className="mb-4" style={{ width: '20%' }} />
        {approved.length === 0 ? (
          <h4>No proposals were made.</h4>
        ) : (
          <>
            <h4>Approved proposals</h4>
            <Table hover className="mx-auto" style={{ width: '80%', minWidth: '500px' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cost</th>
                  <th>Description</th>
                  <th>Author</th>
                </tr>
              </thead>
              <tbody>
                {approved
                  .sort((d1, d2) => d2.preferences - d1.preferences)
                  .map((proposal, key) => (
                    <tr key={key} className="mt-3 justify-content-center">
                      <td>{key + 1}</td>
                      <td>
                        {proposal.cost} {CURRENCY}
                      </td>
                      <td>{proposal.description}</td>
                      <td>{proposal.user.name}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {!hideNotApproved ? (
              <>
                <h4>Not approved proposals</h4>
                <Table hover className="mx-auto" style={{ width: '80%', minWidth: '500px' }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cost</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notApproved.map((proposal, key) => (
                      <tr key={key} className="mt-3 justify-content-center">
                        <td>{key + 1}</td>
                        <td>
                          {proposal.cost} {CURRENCY}
                        </td>
                        <td>{proposal.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </Col>
    </>
  );
};

Results.propTypes = {
  hideNotApproved: PropTypes.bool,
};

export default Results;
