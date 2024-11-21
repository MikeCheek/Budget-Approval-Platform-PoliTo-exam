import express from 'express';
import { isAdmin, isLoggedIn, onValidationErrors } from '../utilities/helpers.mjs';
import { check, validationResult } from 'express-validator';
import PreferenceDao from '../dao/preference.mjs';
import { MAX_SCORE, MIN_SCORE } from '../utilities/constants.mjs';

export default function PreferenceRoutes() {
  this.router = express.Router();
  this.dao = new PreferenceDao();

  this.initRoutes = () => {
    // GET /
    // Get current user preferences
    this.router.get('/', isLoggedIn, (req, res, next) => {
      this.dao
        .getUserPreferences(req.user.id)
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json(data);
        })
        .catch((err) => next(err));
    });

    // POST /
    // Add new preference
    this.router.post(
      '/',
      isLoggedIn,
      check('proposalId').exists().isNumeric(),
      check('score').exists().isInt({ min: MIN_SCORE, max: MAX_SCORE }),
      (req, res, next) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
          return onValidationErrors(invalidFields, res);
        }
        this.dao
          .expressPreference(req.body.proposalId, req.user.id, req.body.score)
          .then((data) => {
            if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
            else res.status(200).json({ ok: true });
          })
          .catch((err) => next(err));
      }
    );

    // DELETE /:proposalId
    // Delete preference
    this.router.delete('/:proposalId', isLoggedIn, (req, res, next) => {
      this.dao
        .revokePreference(req.params.proposalId, req.user.id)
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json({ ok: true });
        })
        .catch((err) => next(err));
    });
  };

  this.initRoutes();
}
