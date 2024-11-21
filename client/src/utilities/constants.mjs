const USER_ROLE = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
};

const NUM_PHASES = 3;

const MIN_SCORE = 1;
const MAX_SCORE = 3;

const MAX_PROPOSALS = 3;

const CURRENCY = '€';

const PHASE = {
  0: 'Budget Definition',
  1: `Make up to ${MAX_PROPOSALS} proposals`,
  2: 'Express preferences',
  3: 'Results',
};

const isValidEUR = (amount) => {
  const amountStr = amount.toString();
  const eurPattern = /^\d+(\.\d{1,2})?$/;
  return eurPattern.test(amountStr);
};

export { USER_ROLE, NUM_PHASES, PHASE, MIN_SCORE, MAX_SCORE, MAX_PROPOSALS, CURRENCY, isValidEUR };
