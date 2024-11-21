import express from 'express';
import { isAdmin, isLoggedIn, onValidationErrors } from '../utilities/helpers.mjs';
import { body, check, validationResult } from 'express-validator';
import ProposalDao from '../dao/proposal.mjs';

export default function ProposalRoutes() {
  this.router = express.Router();
  this.dao = new ProposalDao();

  this.initRoutes = () => {
    // GET /
    // Get current user proposals
    this.router.get('/', isLoggedIn, (req, res, next) => {
      this.dao
        .getMyProposals(req.user.id)
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json(data);
        })
        .catch((err) => next(err));
    });

    // GET /all
    // Get all proposals except users' ones
    this.router.get('/all', isLoggedIn, (req, res, next) => {
      this.dao
        .getAllProposals(req.user.id)
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json(data);
        })
        .catch((err) => next(err));
    });

    // GET /approved
    // Get approved proposals
    this.router.get('/approved', (req, res, next) => {
      this.dao
        .getApprovedProposals()
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json(data);
        })
        .catch((err) => next(err));
    });

    // GET /not-approved
    // Get not approved proposals
    this.router.get('/not-approved', isLoggedIn, (req, res, next) => {
      this.dao
        .getNotApprovedProposals()
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json(data);
        })
        .catch((err) => next(err));
    });

    // POST /
    // Add new proposal
    this.router.post(
      '/',
      isLoggedIn,
      check('description').exists().isString().notEmpty(),
      check('cost').exists().isNumeric(),
      check('processId').exists().isNumeric(),
      (req, res, next) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
          return onValidationErrors(invalidFields, res);
        }
        this.dao
          .newProposal(req.user.id, req.body.processId, req.body.description, req.body.cost)
          .then((data) => {
            if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
            else res.status(200).json({ ok: true });
          })
          .catch((err) => next(err));
      }
    );

    // PUT /:id
    // Modify existent proposal
    this.router.put(
      '/:id',
      isLoggedIn,
      check('description').exists().isString().notEmpty(),
      check('cost').exists().isNumeric(),
      (req, res, next) => {
        this.dao
          .modifyProposal(req.params.id, req.user.id, req.body.description, req.body.cost)
          .then((data) => {
            if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
            else res.status(200).json({ ok: true });
          })
          .catch((err) => next(err));
      }
    );

    // DELETE /:id
    // Delete existent proposal
    this.router.delete('/:id', isLoggedIn, (req, res, next) => {
      this.dao
        .deleteProposal(req.params.id, req.user.id)
        .then((data) => {
          if (data.error) res.status(data.errorCode ? data.errorCode : 400).json(data);
          else res.status(200).json({ ok: true });
        })
        .catch((err) => next(err));
    });
  };

  this.initRoutes();
}
