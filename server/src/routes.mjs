import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import UserDao from './dao/user.mjs';
import morgan from 'morgan';
import session from 'express-session';
import AuthRoutes from './routers/auth.mjs';
import ProcessRoutes from './routers/process.mjs';
import PreferenceRoutes from './routers/preference.mjs';
import ProposalRoutes from './routers/proposal.mjs';

const PATH_PREFIX = '/api';

const initRoutes = (app) => {
  const userDao = new UserDao();

  app.use(morgan('dev'));
  app.use(express.json());

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, callback) => {
        const user = await userDao.getUserByCredentials(username, password);
        if (!user) return callback(null, false, 'Incorrect username or password');

        return callback(null, user);
      }
    )
  );

  passport.serializeUser((user, callback) => {
    callback(null, user);
  });

  passport.deserializeUser((user, callback) => {
    return callback(null, user);
    // return userDao.getUserById(user.id).then((user) => callback(null, user)).catch((err) => callback(err, null));
  });

  app.use(
    session({
      secret: 'Super secret, do not tell anyone!',
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.authenticate('session'));

  const authRoutes = new AuthRoutes();
  const processRoutes = new ProcessRoutes();
  const preferenceRoutes = new PreferenceRoutes();
  const proposalRoutes = new ProposalRoutes();

  app.use(`${PATH_PREFIX}/sessions`, authRoutes.router);
  app.use(`${PATH_PREFIX}/process`, processRoutes.router);
  app.use(`${PATH_PREFIX}/preference`, preferenceRoutes.router);
  app.use(`${PATH_PREFIX}/proposal`, proposalRoutes.router);
};

export default initRoutes;
