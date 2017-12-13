import React from 'react';
import { Link } from 'react-router';
import cls from 'classnames';
import { Button } from 'components';

const DocumentLink = ({
  children,
  className = '',
  uri = '',
  replace = false,
  ...props
}) => {
  const style = require('./DocumentLink.scss');
  const uriProp = {
    [replace ? 'replace' : 'to']: uri
  };
  return <Link {...uriProp} ><Button className={cls(style.DocumentLink, className) } {...props} >{ children }</Button></Link>;
};

export default DocumentLink;
