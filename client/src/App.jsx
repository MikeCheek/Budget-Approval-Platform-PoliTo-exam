import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { useEffect, useState } from 'react';
import { Button, Container, Modal, Toast, ToastBody } from 'react-bootstrap';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import Header from './components/molecules/Header.jsx';
import NotFoundLayout from './components/organisms/NotFoundLayout.jsx';
import LoginLayout from './components/organisms/LoginLayout.jsx';
import { FeedbackContext } from './contexts/FeedbackContext.js';
import API from './API.js';
import AnonymousLayout from './components/organisms/AnonymousLayout.jsx';
import WelcomeLayout from './components/organisms/WelcomeLayout.jsx';
import AdminProcessLayout from './components/organisms/AdminProcessLayout.jsx';
import { USER_ROLE } from './utilities/constants.mjs';
import MemberProcessLayout from './components/organisms/MemberProcessLayout.jsx';
import BudgetLayout from './components/organisms/BudgetLayout.jsx';
import NotAllowedLayout from './components/organisms/NotAllowedLayout.jsx';
import MakeProposalLayout from './components/organisms/MakeProposalLayout.jsx';
import { ModalContext } from './contexts/ModalContext.js';

function App() {
  const [feedback, setFeedback] = useState('');
  const closedModal = { show: false, text: '', action: () => {} };
  const [modal, setModal] = useState(closedModal);

  const [refresh, setRefresh] = useState(0);
  const [remount, setRemount] = useState(0);

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const [process, setProcess] = useState();

  const navigate = useNavigate();

  const handleModalClose = () => {
    setModal(closedModal);
  };

  const showModal = (text, action) => {
    setModal({
      show: true,
      text,
      action,
    });
  };

  const checkUser = () =>
    API.getUserInfo()
      .then((user) => {
        setLoggedIn(true);
        setUser(user);
      })
      .catch((e) => {
        if (loggedIn) setFeedbackFromError(e);
        setLoggedIn(false);
        setUser(null);
      });

  const setFeedbackFromError = (err, reload = true) => {
    let message = '';
    if (err.message) message = err.message;
    else message = 'Unknown Error';
    setFeedback(message);
    if (message === 'Not authorized') checkUser();
    if (reload || message.includes('only in phase')) {
      shouldRefresh();
      navigate('/process');
    } else checkUser();
  };

  useEffect(() => {
    checkUser();
  }, []);

  const isAdmin = () => user.role === USER_ROLE.ADMIN;
  const isMember = () => user.role === USER_ROLE.MEMBER;

  const handleLogin = async (credentials) => {
    const user = await API.logIn(credentials);
    setUser(user);
    setLoggedIn(true);
    setFeedback('Welcome, ' + user.name);
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const shouldRefresh = () => {
    setRefresh((r) => (r + 1) % 2);
  };

  useEffect(() => {
    if (user)
      API.getProcess()
        .then((p) => {
          if (process && p.phase === process.phase) setRemount((r) => (r + 1) % 2);
          setProcess(p ? p : null);
        })
        .catch((e) => setFeedbackFromError(e));
    else {
      setProcess(null);
      // navigate('/');
    }
  }, [refresh]);

  useEffect(() => {
    shouldRefresh();
  }, [user]);

  return (
    <ModalContext.Provider value={{ showModal, closeModal: handleModalClose }}>
      <FeedbackContext.Provider value={{ setFeedback, setFeedbackFromError, shouldRefresh }}>
        <div className="min-vh-100 d-flex flex-column mb-5">
          <Header logout={handleLogout} user={user} loggedIn={loggedIn} />
          <Container fluid className="flex-grow-1 d-flex flex-column mb-5">
            <Routes>
              <Route path="/" element={loggedIn ? <Navigate replace to="/process" /> : <WelcomeLayout />} />
              <Route
                path="/process"
                element={
                  loggedIn ? (
                    isAdmin() ? (
                      <AdminProcessLayout key={remount} process={process} />
                    ) : (
                      <MemberProcessLayout key={remount} process={process} />
                    )
                  ) : (
                    <AnonymousLayout />
                  )
                }
              />
              <Route
                path="/budget"
                element={
                  loggedIn ? (
                    isAdmin() ? (
                      <BudgetLayout />
                    ) : (
                      <Navigate replace to="/process" />
                    )
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route
                path="/proposal"
                element={loggedIn ? <MakeProposalLayout process={process} /> : <Navigate replace to="/login" />}
              />
              <Route
                path="/login"
                element={loggedIn ? <Navigate replace to="/" /> : <LoginLayout login={handleLogin} />}
              />
              <Route path="*" element={<NotFoundLayout />} />
            </Routes>
            <Toast
              show={feedback !== ''}
              autohide
              onClose={() => setFeedback('')}
              delay={4000}
              position="top-start"
              className="position-fixed start-0 m-3 text-start"
            >
              <ToastBody>{feedback}</ToastBody>
            </Toast>
            <Modal show={modal.show} onHide={handleModalClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Body>{modal.text}</Modal.Body>
              <Modal.Footer>
                <Button variant="red" onClick={handleModalClose}>
                  No
                </Button>
                <Button variant="green" onClick={modal.action}>
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>
          </Container>
        </div>
      </FeedbackContext.Provider>
    </ModalContext.Provider>
  );
}

export default App;
