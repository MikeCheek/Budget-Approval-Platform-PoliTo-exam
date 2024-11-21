import db from '../db/db.mjs';
import {
  NoBudgetError,
  NoProcessError,
  NotValidEurError,
  PhaseOneOnlyError,
  PhaseThreeOnlyError,
  PhaseTwoOnlyError,
} from '../errors/processError.mjs';
import {
  CostOverBudgetError,
  MaxProposalsReachedError,
  NotFoundError,
  NotYourProposalError,
} from '../errors/proposalError.mjs';
import { isValidEUR } from '../utilities/helpers.mjs';
import PreferenceDao from './preference.mjs';
import ProcessDao from './process.mjs';
import UserDao from './user.mjs';

const processDao = new ProcessDao();
const userDao = new UserDao();
const preferenceDao = new PreferenceDao();

export default function ProposalDao() {
  this.canMakeNewProposal = (userId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) as count FROM proposals WHERE userId=?';
      db.get(query, [userId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        const count = row.count;
        if (count >= 3) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  };

  this.newProposal = (userId, processId, description, cost) => {
    return new Promise(async (resolve, reject) => {
      if (!isValidEUR(cost)) {
        resolve(NotValidEurError);
        return;
      }
      const process = await processDao.getProcess();
      if (!process) {
        resolve(NoProcessError);
        return;
      }
      if (process.phase != 1) {
        resolve(PhaseOneOnlyError);
        return;
      }
      const check = await this.canMakeNewProposal(userId);
      if (!check) {
        resolve(MaxProposalsReachedError);
        return;
      }
      if (!process.budget) {
        resolve(NoBudgetError);
        return;
      }
      if (cost > process.budget) {
        resolve(CostOverBudgetError);
        return;
      }
      const query = 'INSERT INTO proposals(userId, processId, description, cost, approved) VALUES(?,?,?,?,?)';
      db.run(query, [userId, processId, description, cost, false], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };

  this.getProposal = (id) => {
    return new Promise(async (resolve, reject) => {
      const query = 'SELECT * FROM proposals WHERE id=?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };

  this.helperAllProposals = () => {
    return new Promise(async (resolve, reject) => {
      const query = 'SELECT * FROM proposals';
      db.all(query, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };

  this.getAllProposals = (userId) => {
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
      const proposals = await this.helperAllProposals();
      const filtered = proposals.filter((p) => p.userId != userId);

      const preferences = await preferenceDao.getUserPreferences(userId);

      if (preferences && preferences.length > 0)
        preferences.forEach((p) => {
          const index = filtered.findIndex((f) => f.id === p.proposalId);
          if (index != -1) filtered[index] = { ...filtered[index], preference: p.score };
        });
      resolve(filtered);
    });
  };

  this.updatePreferences = (preferences, id) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE proposals SET preferences=? WHERE id=?';
      db.run(query, [preferences, id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };

  this.approveProposal = (id) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE proposals SET approved=? WHERE id=?';
      db.run(query, [true, id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };

  this.calculateScores = () => {
    return new Promise(async (resolve, reject) => {
      const proposals = await this.helperAllProposals();
      for (let i = 0; i < proposals.length; i++) {
        const proposal = proposals[i];
        const preferences = await preferenceDao.getPreferencesSum(proposal.id);
        await this.updatePreferences(preferences, proposal.id);
      }
      resolve(true);
    });
  };

  this.getMyProposals = (userId) => {
    return new Promise(async (resolve, reject) => {
      const query = 'SELECT * FROM proposals WHERE userId=?';
      db.all(query, [userId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };

  this.modifyProposal = (id, userId, description, cost) => {
    return new Promise(async (resolve, reject) => {
      if (!isValidEUR(cost)) {
        resolve(NotValidEurError);
        return;
      }
      const process = await processDao.getProcess();
      if (!process) {
        resolve(NoProcessError);
        return;
      }
      if (process.phase != 1) {
        resolve(PhaseOneOnlyError);
        return;
      }
      const proposal = await this.getProposal(id);
      if (!proposal) {
        resolve(NotFoundError);
        return;
      }
      if (proposal.userId != userId) {
        resolve(NotYourProposalError);
        return;
      }

      if (!process.budget) {
        resolve(NoBudgetError);
        return;
      }
      if (cost > process.budget) {
        resolve(CostOverBudgetError);
        return;
      }
      const query = 'UPDATE proposals SET description=?, cost=? WHERE id=?';
      db.run(query, [description, cost, id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };

  this.deleteProposal = (id, userId) => {
    return new Promise(async (resolve, reject) => {
      const process = await processDao.getProcess();
      if (!process) {
        resolve(NoProcessError);
        return;
      }
      if (process.phase != 1) {
        resolve(PhaseOneOnlyError);
        return;
      }
      const proposal = await this.getProposal(id);
      if (!proposal) {
        resolve(NotFoundError);
        return;
      }
      if (proposal.userId != userId) {
        resolve(NotYourProposalError);
        return;
      }
      const query = 'DELETE FROM proposals WHERE id=?';
      db.run(query, [id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };

  this.getApprovedProposals = () => {
    return new Promise(async (resolve, reject) => {
      const process = await processDao.getProcess();
      if (!process) {
        resolve(NoProcessError);
        return;
      }
      if (process.phase != 3) {
        resolve(PhaseThreeOnlyError);
        return;
      }
      const query = 'SELECT * FROM proposals WHERE approved=TRUE';
      db.all(query, async (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        let out = [];
        for (let i = 0; i < row.length; i++) {
          const { userId, id, description, cost, preferences } = row[i];
          const { name, username } = await userDao.getUserById(userId);
          out.push({ id, description, cost, preferences, user: { id: userId, name, username } });
        }
        resolve(out);
      });
    });
  };

  this.getNotApprovedProposals = () => {
    return new Promise(async (resolve, reject) => {
      const process = await processDao.getProcess();
      if (!process) {
        resolve(NoProcessError);
        return;
      }
      if (process.phase != 3) {
        resolve(PhaseThreeOnlyError);
        return;
      }
      const query = 'SELECT * FROM proposals WHERE approved=FALSE OR approved IS NULL';
      db.all(query, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };
}
