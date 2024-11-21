const ITS_OWN = 'You cannot express a preference on your own proposal';
const NOT_ITS_OWN = "You cannot modify another's user preference";
const ONLY_ONE = 'You cannot express more than a preference for a proposal';
const NOT_FOUND = 'Preference not found';

const ItsOwnError = {
  error: ITS_OWN,
  errorCode: 400,
};

const NotItsOwnError = {
  error: NOT_ITS_OWN,
  errorCode: 400,
};

const OnlyOneError = {
  error: ONLY_ONE,
  errorCode: 400,
};

const NotFoundError = {
  error: NOT_FOUND,
  errorCode: 404,
};

export { ItsOwnError, NotItsOwnError, OnlyOneError, NotFoundError };
