import Process from './models/Process.js';
import Proposal, { ApprovedProposal } from './models/Proposal.js';

const SERVER_URL = 'http://localhost:3001/api';

async function handleInvalidResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw Error(error.error ? error.error : response.statusText);
  }
  let type = response.headers.get('Content-Type');
  if (type !== null && type.indexOf('application/json') === -1) {
    throw new TypeError(`Expected JSON, got ${type}`);
  }
  return response;
}

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = (credentials) =>
  fetch(SERVER_URL + '/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = () =>
  fetch(SERVER_URL + '/sessions/current', {
    credentials: 'include',
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());

/**
 * This function destroy the current user's session (executing the log-out).
 */
const logOut = () =>
  fetch(SERVER_URL + '/sessions/current', {
    method: 'DELETE',
    credentials: 'include',
  }).then(handleInvalidResponse);

const getProcess = () =>
  fetch(SERVER_URL + '/process', { credentials: 'include' })
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((process) => new Process(process.id, process.phase, process.budget));

const getPhase = () =>
  fetch(SERVER_URL + '/process/phase', { credentials: 'include' })
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((data) => data.phase);

const getAllProposals = () =>
  fetch(SERVER_URL + '/proposal/all', { credentials: 'include' })
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((data) => data.map((p) => new Proposal(p.id, p.userId, p.processId, p.description, p.cost, p.preference)));

const getApprovedProposals = () =>
  fetch(SERVER_URL + '/proposal/approved', { credentials: 'include' })
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((data) => data.map((p) => new ApprovedProposal(p.id, p.description, p.cost, p.preferences, p.user)));

const getNotApprovedProposals = () =>
  fetch(SERVER_URL + '/proposal/not-approved', { credentials: 'include' })
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((data) => data.map((p) => new Proposal(p.id, null, p.processId, p.description, p.cost)));

const setBudget = (budget) =>
  fetch(SERVER_URL + '/process/budget', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ budget }),
  }).then(handleInvalidResponse);

const getUserProposals = () =>
  fetch(SERVER_URL + '/proposal', { credentials: 'include' })
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((data) => data.map((p) => new Proposal(p.id, p.userId, p.processId, p.description, p.cost)));

const makeProposal = (description, cost, processId) =>
  fetch(SERVER_URL + '/proposal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ description, cost, processId }),
  }).then(handleInvalidResponse);

const editProposal = (proposalId, description, cost) =>
  fetch(SERVER_URL + '/proposal/' + proposalId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ description, cost }),
  }).then(handleInvalidResponse);

const nextPhase = () =>
  fetch(SERVER_URL + '/process/next', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({}),
  }).then(handleInvalidResponse);

const restartProcess = () =>
  fetch(SERVER_URL + '/process/restart', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({}),
  }).then(handleInvalidResponse);

const deleteProposal = (id) =>
  fetch(SERVER_URL + '/proposal/' + id, {
    method: 'DELETE',
    credentials: 'include',
  }).then(handleInvalidResponse);

const addPreference = (proposalId, score) =>
  fetch(SERVER_URL + '/preference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ proposalId, score }),
  }).then(handleInvalidResponse);

const deletePreference = (proposalId) =>
  fetch(SERVER_URL + '/preference/' + proposalId, {
    method: 'DELETE',
    credentials: 'include',
  }).then(handleInvalidResponse);

const API = {
  logIn,
  getUserInfo,
  logOut,
  getProcess,
  getPhase,
  getAllProposals,
  getApprovedProposals,
  getNotApprovedProposals,
  setBudget,
  getUserProposals,
  makeProposal,
  editProposal,
  nextPhase,
  restartProcess,
  deleteProposal,
  addPreference,
  deletePreference,
};
export default API;
