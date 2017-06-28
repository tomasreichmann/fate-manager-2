import React from 'react';

const Alert = ({ message, children, className = '' }) => {
  const cls = className.split(' ').concat( 'Alert alert alert-danger'.split(' ') ).join(' ');
  return <div className={cls} role="alert">{message || children}</div>;
};

export default Alert;
