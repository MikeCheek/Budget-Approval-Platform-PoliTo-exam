import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return <Spinner style={{ width: '3rem', height: '3rem' }} className="m-5" size={40} />;
};

export default Loader;
