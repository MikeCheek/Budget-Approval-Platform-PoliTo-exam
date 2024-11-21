import React, { useContext } from 'react';

const FeedbackContext = React.createContext({
  setFeedback: (message) => {},
  setFeedbackFromError: (error) => {},
  shouldRefresh: () => {},
});

const useFeedbackContext = () => useContext(FeedbackContext);

export { FeedbackContext, useFeedbackContext };
