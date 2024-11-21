const NOT_FOUND = 'Proposal not found';
const COST_OVER_BUDGET = 'Cost of proposal cannot be higher than budget';
const NOT_YOUR_PROPOSAL = "You cannot modify another users' proposal";
const MAX_PROPOSALS_REACHED = "You've reached the maximum number of proposal a user can make";

const NotFoundError = {
  error: NOT_FOUND,
  errorCode: 404,
};

const CostOverBudgetError = {
  error: COST_OVER_BUDGET,
  errorCode: 400,
};

const NotYourProposalError = {
  error: NOT_YOUR_PROPOSAL,
  errorCode: 400,
};

const MaxProposalsReachedError = {
  error: MAX_PROPOSALS_REACHED,
  errorCode: 400,
};

export { NotFoundError, CostOverBudgetError, NotYourProposalError, MaxProposalsReachedError };
