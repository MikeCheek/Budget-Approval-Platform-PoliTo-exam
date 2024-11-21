import React, { useContext } from 'react';

const ModalContext = React.createContext({
  showModal: (text, action) => {},
  closeModal: () => {},
});

const useModalContext = () => useContext(ModalContext);

export { ModalContext, useModalContext };
