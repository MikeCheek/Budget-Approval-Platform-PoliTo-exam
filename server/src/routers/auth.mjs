import express from 'express';
import passport from 'passport';

export default function AuthRoutes() {
  this.router = express.Router();

  this.initRoutes = () => {
    // POST /
    // This route is used for performing login.
    this.router.post('/', (req, res, next) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ error: info });
        }
        req.login(user, (err) => {
          if (err) return next(err);
          return res.json(req.user);
        });
      })(req, res, next);
    });

    // GET /current
    // This route checks whether the user is logged in or not.
    this.router.get('/current', (req, res) => {
      if (req.isAuthenticated()) {
        res.status(200).json(req.user);
      } else res.status(401).json({ error: 'Not authenticated' });
    });

    // DELETE /current
    // This route is used for loggin out the current user.
    this.router.delete('/current', (req, res) => {
      req.logout(() => {
        res.end();
      });
    });
  };

  this.initRoutes();
}
