import db from '../db/db.mjs';
import { NUM_PHASES } from '../utilities/constants.mjs';
import {
  FinishedError,
  NoProcessError,
  PhaseZeroOnlyError,
  NoBudgetError,
  PhaseThreeOnlyError,
  NotValidEurError,
} from '../errors/processError.mjs';
import Process from '../components/process.mjs';
import ProposalDao from './proposal.mjs';
import { isValidEUR } from '../utilities/helpers.mjs';

const proposalDao = new ProposalDao();

export default function ProcessDao() {
  this.createProcess = () => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO processes(phase) VALUES(0)';
      db.run(query, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };

  this.isProcessFinished = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM processes WHERE phase=' + NUM_PHASES;
      db.get(query, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row === undefined) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  };

  this.getProcess = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM processes';
      db.get(query, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };

  this.getPhase = () => {
    return new Promise((resolve, reject) => {
      this.getProcess()
        .then((process) => resolve({ phase: process.phase }))
        .catch((err) => reject(err));
    });
  };

  this.getOrCreateProcess = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let process = await this.getProcess();
        if (!process) {
          await this.createProcess();
          process = await this.getProcess();
        }
        resolve(process);
      } catch (err) {
        reject(err);
      }
    });
  };

  this.restartProcess = () => {
    return new Promise(async (resolve, reject) => {
      const current = await this.getProcess();
      if (current) {
        const finished = await this.isProcessFinished();
        if (!finished) {
          resolve(PhaseThreeOnlyError);
          return;
        }
        db.run(`DELETE FROM preferences`, (err) => {
          if (err) {
            reject('Error deleting preferences data:', err.message);
            return;
          }
        });
        db.run(`DELETE FROM proposals`, (err) => {
          if (err) {
            console.log(err);
            reject('Error deleting proposals data:', err.message);
            return;
          }
        });
        db.run(`DELETE FROM processes`, (err) => {
          if (err) {
            console.log(err);
            reject('Error deleting processes data:', err.message);
            return;
          }
        });
      }
      await this.createProcess();
      resolve(true);
    });
  };

  this.defineBudgetAndGoNextPhase = (budget) => {
    return new Promise(async (resolve, reject) => {
      if (!isValidEUR(budget)) {
        resolve(NotValidEurError);
        return;
      }
      const process = await this.getProcess();
      if (!process) {
        resolve(NoProcessError);
        return;
      }
      if (process.phase != 0) {
        resolve(PhaseZeroOnlyError);
        return;
      }
      const query = 'UPDATE processes SET phase=?, budget=? WHERE id=?';
      db.run(query, [process.phase + 1, budget, process.id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };

  this.nextPhase = () => {
    return new Promise(async (resolve, reject) => {
      const process = await this.getProcess();
      if (!process) {
        resolve(NoProcessError);
        return;
      }
      if (process.phase === 0) {
        resolve(NoBudgetError);
        return;
      }
      if (process.phase === NUM_PHASES) {
        resolve(FinishedError);
        return;
      }
      if (process.phase === 2) {
        try {
          const budget = process.budget;
          await proposalDao.calculateScores();
          const proposals = await proposalDao.helperAllProposals();
          const proposalsOrdered = proposals.sort((p1, p2) => {
            let res = p2.preferences - p1.preferences;
            if (res == 0) res = p2.createdAt - p1.createdAt;
            return res;
          });
          let sum = 0;
          let i = 0;
          let exit = false;
          while (sum <= budget && i < proposalsOrdered.length && !exit) {
            const prop = proposalsOrdered[i];
            if (prop) {
              sum += prop.cost;
              if (sum <= budget) await proposalDao.approveProposal(prop.id);
              else exit = true;
            }
            i++;
          }
        } catch (err) {
          reject(err);
        }
      }
      const query = 'UPDATE processes SET phase=? WHERE id=?';
      db.run(query, [process.phase + 1, process.id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };
}
