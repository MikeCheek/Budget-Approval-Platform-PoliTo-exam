import express from 'express';
import ProcessDao from '../dao/process.mjs';
import { isAdmin, isLoggedIn, onValidationErrors } from '../utilities/helpers.mjs';
import { body, check, validationResult } from 'express-validator';

export default function ProcessRoutes() {
  this.router = express.Router();
  this.dao = new ProcessDao();

  this.initRoutes = () => {
    // GET /
    // Get current process
    this.router.get('/', isLoggedIn, (req, res, next) => {
      this.dao
        .getOrCreateProcess()
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json(data);
        })
        .catch((err) => next(err));
    });

    // GET /phase
    // Get current process phase
    this.router.get('/phase', (req, res, next) => {
      this.dao
        .getPhase()
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json(data);
        })
        .catch((err) => next(err));
    });

    // POST /restart
    // Create new process
    this.router.post('/restart', isLoggedIn, isAdmin, (req, res, next) => {
      this.dao
        .restartProcess()
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json({ ok: true });
        })
        .catch((err) => next(err));
    });

    // POST /budget
    // Defines budget and goes to next phase
    this.router.post('/budget', isLoggedIn, isAdmin, check('budget').exists().isNumeric(), (req, res, next) => {
      const invalidFields = validationResult(req);

      if (!invalidFields.isEmpty()) {
        return onValidationErrors(invalidFields, res);
      }
      this.dao
        .defineBudgetAndGoNextPhase(req.body.budget)
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json({ ok: true });
        })
        .catch((err) => next(err));
    });

    // POST /next
    // Go to next phase
    this.router.post('/next', isLoggedIn, isAdmin, (req, res, next) => {
      this.dao
        .nextPhase()
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json({ ok: true });
        })
        .catch((err) => next(err));
    });
  };

  this.initRoutes();
}
