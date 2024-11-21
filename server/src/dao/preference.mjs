import db from '../db/db.mjs';
import {
  ItsOwnError,
  NotItsOwnError,
  OnlyOneError,
  NotFoundError as PreferenceNotFoundError,
} from '../errors/preferenceError.mjs';
import { NoProcessError, PhaseTwoOnlyError } from '../errors/processError.mjs';
import { NotFoundError } from '../errors/proposalError.mjs';
import ProcessDao from './process.mjs';
import ProposalDao from './proposal.mjs';

const proposalDao = new ProposalDao();
const processDao = new ProcessDao();

export default function PreferenceDao() {
  this.getPreference = (proposalId, userId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM preferences WHERE proposalId=? AND userId=?';
      db.get(query, [proposalId, userId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };

  this.getUserPreferences = (userId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM preferences WHERE userId=?';
      db.all(query, [userId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };

  this.getPreferencesSum = (id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT SUM(score) as sumscores FROM preferences WHERE proposalId=?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row.sumscores ? row.sumscores : 0);
      });
    });
  };

  this.expressPreference = (proposalId, userId, score) => {
    return new Promise(async (resolve, reject) => {
      const process = await processDao.getProcess();
      if (!process) {
        resolve(NoProcessError);
        return;
      }
      if (process.phase != 2) {
        resolve(PhaseTwoOnlyError);
        return;
      }
      const proposal = await proposalDao.getProposal(proposalId);
      if (!proposal) {
        resolve(NotFoundError);
        return;
      }
      if (proposal.userId === userId) {
        resolve(ItsOwnError);
        return;
      }
      const preference = await this.getPreference(proposalId, userId);
      if (preference) {
        resolve(OnlyOneError);
        return;
      }
      const query = 'INSERT INTO preferences(proposalId, userId, score) VALUES(?,?,?)';
      db.run(query, [proposalId, userId, score], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };

  this.revokePreference = (proposalId, userId) => {
    return new Promise(async (resolve, reject) => {
      const process = await processDao.getProcess();
      if (!process) {
        resolve(NoProcessError);
        return;
      }
      if (process.phase != 2) {
        resolve(PhaseTwoOnlyError);
        return;
      }
      const proposal = await proposalDao.getProposal(proposalId);
      if (!proposal) {
        resolve(NotFoundError);
        return;
      }
      if (proposal.userId === userId) {
        resolve(ItsOwnError);
        return;
      }
      const preference = await this.getPreference(proposalId, userId);
      if (!preference) {
        resolve(PreferenceNotFoundError);
      }
      if (preference.userId != userId) {
        resolve(NotItsOwnError);
        return;
      }
      const query = 'DELETE FROM preferences WHERE proposalId=? AND userId=?';
      db.run(query, [proposalId, userId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };
}
