const FINISHED =
  'Current process is finished, there is no next phase. If you want you can restart the process from scratch.';
const NO_PROCESS = 'No ongoing processes';
const PHASE_ZERO = 'You can do this action only in phase 0';
const PHASE_ONE = 'You can do this action only in phase 1';
const PHASE_TWO = 'You can do this action only in phase 2';
const PHASE_THREE = 'You can do this action only in phase 3';
const NO_BUDGET = 'You must define a budget before';
const NOT_VALID_EUR = 'You must insert a valid EUR number';

const FinishedError = {
  error: FINISHED,
  errorCode: 400,
};

const NoProcessError = {
  error: NO_PROCESS,
  errorCode: 404,
};

const PhaseZeroOnlyError = {
  error: PHASE_ZERO,
  errorCode: 400,
};
const PhaseOneOnlyError = {
  error: PHASE_ONE,
  errorCode: 400,
};
const PhaseTwoOnlyError = {
  error: PHASE_TWO,
  errorCode: 400,
};
const PhaseThreeOnlyError = {
  error: PHASE_THREE,
  errorCode: 400,
};

const NoBudgetError = {
  error: NO_BUDGET,
  errorCode: 404,
};

const NotValidEurError = {
  error: NOT_VALID_EUR,
};

export {
  FinishedError,
  NoProcessError,
  PhaseZeroOnlyError,
  PhaseOneOnlyError,
  PhaseTwoOnlyError,
  PhaseThreeOnlyError,
  NoBudgetError,
  NotValidEurError,
};
