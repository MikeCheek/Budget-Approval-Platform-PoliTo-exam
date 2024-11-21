import { USER_ROLE } from './constants.mjs';

const errorFormatter = ({ msg }) => msg;
export const onValidationErrors = (validationResult, res) => {
  const errors = validationResult.formatWith(errorFormatter);
  return res.status(422).json({ validationErrors: errors.mapped() });
};

export const isValidEUR = (amount) => {
  const amountStr = amount.toString();
  const eurPattern = /^\d+(\.\d{1,2})?$/;
  return eurPattern.test(amountStr);
};

// Middleware helpers functions

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Not authorized' });
};

export const isMember = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === USER_ROLE.MEMBER) return next();
  return res.status(401).json({ error: 'User is not a member', status: 401 });
};

export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === USER_ROLE.ADMIN) return next();
  return res.status(401).json({ error: 'User is not an admin', status: 401 });
};

export const isPhase0 = (process) => {
  return process.phase === 0;
};

export const isPhase1 = (process) => {
  return process.phase === 1;
};

export const isPhase2 = (process) => {
  return process.phase === 2;
};

export const isPhase3 = (process) => {
  return process.phase === 3;
};
