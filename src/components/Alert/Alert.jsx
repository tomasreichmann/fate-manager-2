import React from 'react';
import { Map } from 'immutable';

const Alert = ({
  message,
  children,
  className = '',
  warning,
  primary,
  secondary,
  success,
  danger,
  info,
}) => {
  const style = require('./Alert.scss');
  const classString = [style.Alert].concat(
    Map({
      warning,
      primary,
      secondary,
      success,
      danger,
      info,
    })
    .reduce( (classList, cls, key) => (
      cls ? classList.concat(style['Alert--' + key]) : classList
    ), [] )
  )
  .concat( className.split(' ') )
  .join(' ');
  return <div className={classString} role="alert">{children || message || 'no message'}</div>;
};

export default Alert;
